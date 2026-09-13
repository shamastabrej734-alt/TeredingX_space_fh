import React, { useEffect, useState } from 'react';
import { Card, Button } from '../../components/ui';
import { formatCurrency } from '../../lib/utils';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, doc, updateDoc, increment, getDoc, addDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminWithdrawals() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const q = query(collection(db, 'withdrawalRequests'));
      const snap = await getDocs(q);
      const reqs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      reqs.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
      setRequests(reqs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId: string, userId: string, amount: number, action: 'Approve' | 'Reject') => {
    if (!user) return;
    setProcessingId(requestId);
    
    try {
      if (action === 'Approve') {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        const currentBal = userSnap.data()?.virtualBalance || 0;
        
        if (currentBal < amount) {
          toast.error("User does not have enough virtual balance to approve this.");
          setProcessingId(null);
          return;
        }

        await updateDoc(userRef, { virtualBalance: increment(-amount) });
      }

      await updateDoc(doc(db, 'withdrawalRequests', requestId), {
        status: action === 'Approve' ? 'Successful' : 'Rejected',
        processedAt: new Date(),
        adminId: user.uid
      });

      // Find pending transaction and update it. For brevity in demo, we'll just add a new resolved transaction record or they see the updated status.
      // We will create a fresh transaction to represent the resolution
      await addDoc(collection(db, 'transactions'), {
        userId,
        type: 'WITHDRAWAL',
        amount,
        status: action === 'Approve' ? 'Successful' : 'Rejected',
        createdAt: new Date(),
        description: `Admin ${action === 'Approve' ? 'approved' : 'rejected'} withdrawal`
      });

      toast.success(`Withdrawal ${action.toLowerCase()} successfully`);
      fetchRequests();
    } catch(e: any) {
      toast.error('Error processing request: ' + e.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-amber-400">Withdrawal Requests</h1>
        <p className="text-gray-400">Manage virtual withdrawal requests from users.</p>
      </div>

      <Card className="p-0 overflow-hidden border-amber-900/30">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-800/50 text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">User ID</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Method</th>
                  <th className="px-4 py-3 font-medium">Details</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-800/20 transition-colors">
                    <td className="px-4 py-4 text-xs font-mono text-gray-400">{r.userId}</td>
                    <td className="px-4 py-4 text-gray-400">
                      {format(r.createdAt.toDate(), 'MMM d, HH:mm')}
                    </td>
                    <td className="px-4 py-4 font-bold text-white">
                      {formatCurrency(r.amount)}
                    </td>
                    <td className="px-4 py-4">{r.method}</td>
                    <td className="px-4 py-4 text-gray-400">{r.accountDetails}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        r.status === 'Successful' ? 'bg-emerald-500/10 text-emerald-400' :
                        r.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      {r.status === 'Pending' && (
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={processingId === r.id}
                            onClick={() => handleAction(r.id, r.userId, r.amount, 'Approve')}
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded transition-colors disabled:opacity-50"
                            title="Approve"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            disabled={processingId === r.id}
                            onClick={() => handleAction(r.id, r.userId, r.amount, 'Reject')}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors disabled:opacity-50"
                            title="Reject"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No withdrawal requests.
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