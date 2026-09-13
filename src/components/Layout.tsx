import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Briefcase, Wallet, History, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Footer from './Footer';

export default function Layout() {
  const { logout, userData } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Trade', path: '/trade', icon: TrendingUp },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
    { name: 'Wallet', path: '/wallet', icon: Wallet },
    { name: 'History', path: '/history', icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-gray-800 bg-[#0B0E14] px-4 py-6">
        <div className="flex items-center gap-2 px-2 mb-8">
          <TrendingUp className="h-8 w-8 text-indigo-500" />
          <span className="text-xl font-bold tracking-tight">TradingX</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-indigo-600/10 text-indigo-400'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-800 space-y-1">
          {userData?.role === 'admin' && (
            <Link
              to="/admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-amber-400 hover:bg-gray-800/50 transition-colors"
            >
              Admin Panel
            </Link>
          )}
          <Link
            to="/profile"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              location.pathname === '/profile'
                ? 'bg-indigo-600/10 text-indigo-400'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
            }`}
          >
            <User className="h-5 w-5" />
            Profile
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden pb-16 md:pb-0">
        <header className="sticky top-0 z-10 border-b border-gray-800 bg-[#0B0E14]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center md:hidden">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-indigo-500" />
            <span className="font-bold">TradingX</span>
          </div>
          <Link to="/profile" className="text-gray-400">
            <User className="h-6 w-6" />
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex-1 flex flex-col h-full">
            <div className="flex-1">
              <Outlet />
            </div>
            <Footer />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-[#0B0E14]/90 backdrop-blur-md z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 min-w-[64px] ${
                location.pathname === item.path ? 'text-indigo-400' : 'text-gray-500'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}