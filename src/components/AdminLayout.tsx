import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, ArrowLeft } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Withdrawals', path: '/admin/withdrawals', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex flex-col md:flex-row">
      <aside className="hidden md:flex w-64 flex-col border-r border-gray-800 bg-[#0B0E14] px-4 py-6">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="bg-amber-500/20 p-1 rounded">
            <LayoutDashboard className="h-6 w-6 text-amber-500" />
          </div>
          <span className="text-xl font-bold tracking-tight text-amber-400">Admin</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-amber-600/10 text-amber-400'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-800 space-y-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-800/50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Exit Admin
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden pb-16 md:pb-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}