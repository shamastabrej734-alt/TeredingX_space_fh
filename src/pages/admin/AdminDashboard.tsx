import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui';
import { Users, DollarSign, Activity, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    totalBalance: 0,
    totalTrades: 0,
    pendingWithdrawals: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const tradesSnap = await getDocs(collection(db, 'trades'));
        const withdrawSnap = await getDocs(collection(db, 'withdrawalRequests'));

        let bal = 0;
        usersSnap.forEach(d => { bal += d.data().virtualBalance || 0; });
        
        let pending = 0;
        withdrawSnap.forEach(d => { if(d.data().status === 'Pending') pending++; });

        setStats({
          users: usersSnap.size,
          totalBalance: bal,
          totalTrades: tradesSnap.size,
          pendingWithdrawals: pending
        });
      } catch(e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  const mockChartData = [
    { name: 'Mon', volume: 4000 },
    { name: 'Tue', volume: 3000 },
    { name: 'Wed', volume: 2000 },
    { name: 'Thu', volume: 2780 },
    { name: 'Fri', volume: 1890 },
    { name: 'Sat', volume: 2390 },
    { name: 'Sun', volume: 3490 },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-amber-400">Admin Overview</h1>
        <p className="text-gray-400">Platform statistics and management.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex flex-col border-amber-900/30">
          <div className="flex items-center justify-between text-gray-400 mb-4">
            <span className="text-sm font-medium">Total Users</span>
            <Users className="h-5 w-5 text-amber-400" />
          </div>
          <span className="text-3xl font-bold">{stats.users}</span>
        </Card>

        <Card className="flex flex-col border-amber-900/30">
          <div className="flex items-center justify-between text-gray-400 mb-4">
            <span className="text-sm font-medium">Total Virtual Balance</span>
            <DollarSign className="h-5 w-5 text-emerald-400" />
          </div>
          <span className="text-3xl font-bold text-emerald-400">{formatCurrency(stats.totalBalance)}</span>
        </Card>

        <Card className="flex flex-col border-amber-900/30">
          <div className="flex items-center justify-between text-gray-400 mb-4">
            <span className="text-sm font-medium">Total Trades</span>
            <Activity className="h-5 w-5 text-indigo-400" />
          </div>
          <span className="text-3xl font-bold">{stats.totalTrades}</span>
        </Card>

        <Card className="flex flex-col border-amber-900/30">
          <div className="flex items-center justify-between text-gray-400 mb-4">
            <span className="text-sm font-medium">Pending Withdrawals</span>
            <CreditCard className="h-5 w-5 text-red-400" />
          </div>
          <span className="text-3xl font-bold text-red-400">{stats.pendingWithdrawals}</span>
        </Card>
      </div>

      <Card className="mt-8 border-amber-900/30">
        <h3 className="text-lg font-semibold mb-6">Trading Volume (7 Days)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff', borderRadius: '0.5rem' }}
                cursor={{ fill: '#374151', opacity: 0.4 }}
              />
              <Bar dataKey="volume" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}