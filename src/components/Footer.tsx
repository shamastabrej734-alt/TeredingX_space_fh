import React from 'react';
import { TrendingUp, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/50 bg-[#0B0E14] py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-indigo-500" />
            <span className="text-xl font-bold tracking-tight text-white">TradingX</span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Experience the thrill of trading without the risk. TradingX is your premium virtual simulator for mastering the markets.
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold">Join the Community</h4>
          <a 
            href="https://t.me/pro0783" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#24A1DE]/10 hover:bg-[#24A1DE]/20 text-[#24A1DE] transition-colors px-4 py-3 rounded-xl border border-[#24A1DE]/20 w-fit"
          >
            <div className="bg-[#24A1DE] p-2 rounded-full">
              <Send className="h-4 w-4 text-white -ml-0.5 mt-0.5" />
            </div>
            <span className="font-medium">Telegram Channel</span>
          </a>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold">Important Notice</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong className="text-gray-400 block mb-1">Disclaimer:</strong> 
            TradingX is a virtual trading simulator. All balances, profits, deposits, and withdrawals shown on this platform are simulated and have no real monetary value. This platform is strictly for educational and practice purposes.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} TradingX. All rights reserved.</p>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>Virtual Platform</span>
          <span>&bull;</span>
          <span>Risk-Free</span>
        </div>
      </div>
    </footer>
  );
}
