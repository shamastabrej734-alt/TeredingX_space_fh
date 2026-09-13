import React, { useEffect, useState } from 'react';
import { Card, Button, Input } from '../../components/ui';
import { formatCurrency } from '../../lib/utils';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, updateDoc, addDoc, runTransaction } from 'firebase/firestore';
import { format } from 'date-fns';
import { Loader2, Search, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminUsers() {
  const { user: adminUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateBalance = async (userId: string, currentBalance: number) => {
    const amountStr = window.prompt("Enter amount to add (positive) or remove (negative):", "0");
    if (!amountStr) return;
    
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount === 0) return;

    const reason = window.prompt("Enter reason for adjustment (required):");
    if (!reason) {
      toast.error("Reason is required to adjust funds.");
      return;
    }

    if (window.confirm(`Are you sure you want to ${amount > 0 ? 'ADD' : 'REMOVE'} ${formatCurrency(Math.abs(amount))} for this user?`)) {
      try {
        await runTransaction(db, async (transaction) => {
          const userRef = doc(db, 'users', userId);
          const userSnap = await transaction.get(userRef);
          
          if (!userSnap.exists()) throw new Error("User not found");
          
          const newBalance = Math.max(0, (userSnap.data().virtualBalance || 0) + amount);
          
          transaction.update(userRef, { virtualBalance: newBalance });
          
          const logRef = doc(collection(db, 'adminLogs'));
          transaction.set(logRef, {
            adminId: adminUser?.uid,
            userId: userId,
            action: 'ADJUST_BALANCE',
            amount: amount,
            reason: reason,
            timestamp: new Date()
          });
        });

        toast.success("Virtual balance updated successfully");
        fetchUsers();
      } catch (e: any) {
        toast.error("Failed to update balance: " + e.message);
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-amber-400">Manage Users</h1>
          <p className="text-gray-400">View and adjust user virtual balances.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            className="pl-9" 
            placeholder="Search users..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="p-0 overflow-hidden border-amber-900/30">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-800/50 text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Joined Date</th>
                  <th className="px-4 py-3 font-medium">Virtual Balance</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-800/20 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-white">{u.name}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-amber-500/10 text-amber-400' : 'bg-gray-800 text-gray-300'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-400">
                      {u.createdAt ? format(u.createdAt.toDate(), 'MMM d, yyyy') : '-'}
                    </td>
                    <td className="px-4 py-4 font-medium">
                      {formatCurrency(u.virtualBalance || 0)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button 
                        onClick={() => handleUpdateBalance(u.id, u.virtualBalance || 0)}
                        className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                        title="Adjust Balance"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}