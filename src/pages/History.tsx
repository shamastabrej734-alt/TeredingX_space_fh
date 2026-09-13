import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../lib/utils';
import { Card } from '../components/ui';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

export default function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const tradesRef = collection(db, 'trades');
        const tradesQ = query(tradesRef, where('userId', '==', user.uid));
        const tradesSnap = await getDocs(tradesQ);
        
        const txsRef = collection(db, 'transactions');
        const txsQ = query(txsRef, where('userId', '==', user.uid));
        const txsSnap = await getDocs(txsQ);

        const allItems = [
          ...tradesSnap.docs.map(d => ({ id: d.id, _type: 'TRADE', ...d.data() })),
          ...txsSnap.docs.map(d => ({ id: d.id, _type: 'TRANSACTION', ...d.data() }))
        ];

        allItems.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
        
        setHistory(allItems);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const filteredHistory = history.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Buy') return item.type === 'BUY';
    if (filter === 'Sell') return item.type === 'SELL';
    if (filter === 'Deposit') return item.type === 'DEPOSIT';
    if (filter === 'Withdrawal') return item.type === 'WITHDRAWAL';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transaction History</h1>
          <p className="text-gray-400">View all your virtual trades and transfers.</p>
        </div>
        <div className="flex bg-gray-800 p-1 rounded-lg self-start">
          {['All', 'Buy', 'Sell', 'Deposit', 'Withdrawal'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === f ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-800/50 text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Asset / Desc</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-800/20 transition-colors">
                    <td className="px-4 py-4 text-gray-400">
                      {format(item.createdAt.toDate(), 'MMM d, yyyy HH:mm')}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' :
                        item.type === 'SELL' ? 'bg-red-500/10 text-red-400' :
                        item.type === 'DEPOSIT' ? 'bg-indigo-500/10 text-indigo-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {item._type === 'TRADE' ? `${item.quantity} ${item.symbol}` : item.description}
                    </td>
                    <td className="px-4 py-4 font-medium">
                      {formatCurrency(item._type === 'TRADE' ? item.total : item.amount)}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === 'Executed' || item.status === 'Successful' ? 'bg-emerald-500/10 text-emerald-400' :
                        item.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredHistory.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No history found.
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