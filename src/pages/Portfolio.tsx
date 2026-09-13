import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, formatPercentage } from '../lib/utils';
import { Card } from '../components/ui';
import { Briefcase, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const MOCK_PORTFOLIO = [
  { asset: 'BTC', name: 'Bitcoin', quantity: 0.5, avgPrice: 5000000, currentPrice: 5432100 },
  { asset: 'ETH', name: 'Ethereum', quantity: 4.2, avgPrice: 250000, currentPrice: 284500 },
  { asset: 'AAPL', name: 'Apple Inc.', quantity: 50, avgPrice: 13000, currentPrice: 14500 },
];

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

export default function Portfolio() {
  const { userData } = useAuth();
  
  let totalInvested = 0;
  let currentValue = 0;

  const holdings = MOCK_PORTFOLIO.map(item => {
    const invested = item.quantity * item.avgPrice;
    const value = item.quantity * item.currentPrice;
    const pnl = value - invested;
    const pnlPercent = (pnl / invested) * 100;
    
    totalInvested += invested;
    currentValue += value;
    
    return { ...item, invested, value, pnl, pnlPercent };
  });

  const totalPnL = currentValue - totalInvested;
  const totalPnLPercent = (totalPnL / totalInvested) * 100;

  const chartData = holdings.map(h => ({ name: h.asset, value: h.value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Portfolio</h1>
          <p className="text-gray-400">Track your virtual holdings and performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <Card className="lg:col-span-2 overflow-x-auto p-0">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-800/50 text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Asset</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 font-medium">Avg Price</th>
                <th className="px-4 py-3 font-medium">Current Price</th>
                <th className="px-4 py-3 font-medium">Investment</th>
                <th className="px-4 py-3 font-medium">Current Value</th>
                <th className="px-4 py-3 font-medium text-right">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {holdings.map((h) => (
                <tr key={h.asset} className="hover:bg-gray-800/20 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-semibold text-white">{h.asset}</div>
                    <div className="text-xs text-gray-500">{h.name}</div>
                  </td>
                  <td className="px-4 py-4">{h.quantity}</td>
                  <td className="px-4 py-4">{formatCurrency(h.avgPrice)}</td>
                  <td className="px-4 py-4">{formatCurrency(h.currentPrice)}</td>
                  <td className="px-4 py-4">{formatCurrency(h.invested)}</td>
                  <td className="px-4 py-4">{formatCurrency(h.value)}</td>
                  <td className={`px-4 py-4 text-right font-medium ${h.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    <div>{h.pnl >= 0 ? '+' : ''}{formatCurrency(h.pnl).replace('₹', '')}</div>
                    <div className="text-xs">{formatPercentage(h.pnlPercent)}</div>
                  </td>
                </tr>
              ))}
              {holdings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Your portfolio is empty. Start trading!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-400" />
              Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Investment</span>
                <span className="font-medium">{formatCurrency(totalInvested)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Value</span>
                <span className="font-medium">{formatCurrency(currentValue)}</span>
              </div>
              <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                <span className="text-gray-400">Total P&L</span>
                <div className="text-right">
                  <div className={`font-bold text-lg ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL).replace('₹', '')}
                  </div>
                  <div className={`text-sm ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatPercentage(totalPnLPercent)}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-400" />
              Allocation
            </h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff', borderRadius: '0.5rem' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}