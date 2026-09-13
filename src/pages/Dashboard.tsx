import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, formatPercentage } from '../lib/utils';
import { Wallet, TrendingUp, DollarSign, Briefcase, Activity, AlertCircle } from 'lucide-react';
import { Card, Button } from '../components/ui';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { userData } = useAuth();
  
  // Real calculations driven by database
  const virtualBalance = userData?.virtualBalance || 0;
  const portfolioValue = userData?.totalInvestment || 0; // Current holdings value (using totalInvestment as placeholder for holdings value right now)
  const totalProfit = userData?.totalProfit || 0;
  const todayPnL = userData?.todayPnL || 0;
  const isNewUser = userData?.totalTrades === 0;
  
  // Calculate PnL percent relative to total investment, avoid division by zero
  const todayPnLPercent = userData?.totalInvestment ? (todayPnL / userData.totalInvestment) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {userData?.name}</h1>
          <p className="text-gray-400">Here's your virtual trading overview.</p>
        </div>
      </div>

      {isNewUser && (
        <Card className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/30 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                Welcome to TradingX 🎉
              </h2>
              <p className="text-indigo-200 mb-2">
                Your ₹10 virtual welcome bonus has been added. Practice trading with virtual money and learn how the market works.
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
                <AlertCircle className="w-3.5 h-3.5" /> Virtual Money Only
              </div>
            </div>
            <Link to="/trade">
              <Button className="whitespace-nowrap bg-indigo-600 hover:bg-indigo-500 text-white">
                Start Trading
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex flex-col">
          <div className="flex items-center justify-between text-gray-400 mb-4">
            <span className="text-sm font-medium">Virtual Balance</span>
            <Wallet className="h-5 w-5 text-indigo-400" />
          </div>
          <span className="text-3xl font-bold">{formatCurrency(virtualBalance)}</span>
          <span className="text-xs text-gray-500 mt-2">Available for trading</span>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center justify-between text-gray-400 mb-4">
            <span className="text-sm font-medium">Invested Amount</span>
            <Briefcase className="h-5 w-5 text-amber-400" />
          </div>
          <span className="text-3xl font-bold">{formatCurrency(portfolioValue)}</span>
          <span className="text-xs text-gray-500 mt-2">Total investment</span>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center justify-between text-gray-400 mb-4">
            <span className="text-sm font-medium">Total Profit</span>
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </div>
          <span className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
          </span>
          <span className="text-xs text-gray-500 mt-2">All time return</span>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center justify-between text-gray-400 mb-4">
            <span className="text-sm font-medium">Today's P&L</span>
            <DollarSign className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${todayPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {todayPnL >= 0 ? '+' : ''}{formatCurrency(todayPnL).replace('₹', '')}
            </span>
            <span className={`text-sm font-medium ${todayPnLPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ({formatPercentage(todayPnLPercent)})
            </span>
          </div>
          <span className="text-xs text-gray-500 mt-2">Past 24 hours</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Market Overview / Watchlist */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-400" />
            Market Overview
          </h2>
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-800/50 text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Asset</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">24h Change</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {/* Mock Data for market, market prices are usually external */}
                  {[
                    { symbol: 'BTC', name: 'Bitcoin', price: 5432100, change: 2.4 },
                    { symbol: 'ETH', name: 'Ethereum', price: 284500, change: -1.2 },
                    { symbol: 'AAPL', name: 'Apple Inc.', price: 14500, change: 0.8 },
                    { symbol: 'TSLA', name: 'Tesla', price: 16200, change: 4.5 },
                  ].map((asset) => (
                    <tr key={asset.symbol} className="hover:bg-gray-800/20 transition-colors">
                      <td className="px-4 py-4">
                        <div className="font-semibold text-white">{asset.symbol}</div>
                        <div className="text-xs text-gray-500">{asset.name}</div>
                      </td>
                      <td className="px-4 py-4 font-medium">{formatCurrency(asset.price)}</td>
                      <td className={`px-4 py-4 font-medium ${asset.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formatPercentage(asset.change)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <a href="/trade" className="text-indigo-400 hover:text-indigo-300 font-medium text-xs bg-indigo-500/10 px-3 py-1.5 rounded-lg">Trade</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <a href="/wallet" className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:border-indigo-500/50 transition-all text-center gap-2">
              <div className="bg-emerald-500/10 p-2 rounded-lg"><DollarSign className="h-5 w-5 text-emerald-400" /></div>
              <span className="text-xs font-medium">Add Virtual Funds</span>
            </a>
            <a href="/trade" className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:border-indigo-500/50 transition-all text-center gap-2">
              <div className="bg-indigo-500/10 p-2 rounded-lg"><TrendingUp className="h-5 w-5 text-indigo-400" /></div>
              <span className="text-xs font-medium">Trade Now</span>
            </a>
          </div>

          <h2 className="text-lg font-semibold mt-8 mb-4">Recent Activity</h2>
          <Card className="p-4">
            <div className="text-sm text-gray-400 text-center py-6">
              No recent activity. Start trading to see your history here!
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}