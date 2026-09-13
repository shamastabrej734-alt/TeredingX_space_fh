import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, BarChart3, Activity } from 'lucide-react';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-white">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-indigo-500" />
          <span className="text-xl font-bold tracking-tight">TradingX</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors">
            Login
          </Link>
          <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Notice */}
      <div className="bg-indigo-600/10 border-b border-indigo-500/20 text-indigo-200 py-3 text-center text-sm px-4">
        <span className="font-semibold">Important Notice:</span> TradingX is a virtual trading simulator. All balances, profits, deposits and withdrawals are simulated and have no real monetary value.
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 text-center max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
          Practice Trading. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Build Confidence.</span>
        </h1>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Experience realistic trading with virtual money and learn how markets work without risking real funds. Perfect your strategy before going live.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20">
            Start Trading <ArrowRight className="h-5 w-5" />
          </Link>
          <a href="#features" className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-colors border border-gray-700 flex items-center justify-center">
            Explore Platform
          </a>
        </div>
      </div>

      {/* How it Works */}
      <div className="border-t border-gray-800 bg-[#0B0E14] py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Start your journey to becoming a better trader in four simple steps.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up in seconds and get instant access.' },
              { step: '02', title: 'Receive Virtual Balance', desc: 'Get ₹10 bonus on first login plus virtual funds.' },
              { step: '03', title: 'Trade Assets', desc: 'Buy and sell in a realistic market environment.' },
              { step: '04', title: 'Improve Strategy', desc: 'Track your P&L and refine your skills risk-free.' }
            ].map((s) => (
              <div key={s.step} className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
                <div className="text-5xl font-black text-gray-800/50 mb-4">{s.step}</div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Trading Space */}
      <div id="features" className="py-20 bg-[#151A22]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why TradingX?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to practice trading professionally.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-[#0B0E14] p-8 rounded-2xl border border-gray-800">
              <Shield className="h-10 w-10 text-indigo-400 mb-6" />
              <h3 className="text-xl font-semibold mb-3">Risk-Free Learning</h3>
              <p className="text-gray-400 leading-relaxed">Trade with virtual money in a realistic environment without risking your hard-earned capital.</p>
            </div>
            <div className="bg-[#0B0E14] p-8 rounded-2xl border border-gray-800">
              <BarChart3 className="h-10 w-10 text-emerald-400 mb-6" />
              <h3 className="text-xl font-semibold mb-3">Portfolio Tracking</h3>
              <p className="text-gray-400 leading-relaxed">Monitor your virtual investments, track profit and loss, and analyze your performance over time.</p>
            </div>
            <div className="bg-[#0B0E14] p-8 rounded-2xl border border-gray-800">
              <Activity className="h-10 w-10 text-cyan-400 mb-6" />
              <h3 className="text-xl font-semibold mb-3">Realistic Experience</h3>
              <p className="text-gray-400 leading-relaxed">Experience real market dynamics with live-like charts, order executions, and transaction histories.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Creators Section */}
      <div className="py-24 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet the Creators</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">The visionaries behind TradingX and TradingX.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center bg-gray-900/40 p-8 rounded-3xl border border-gray-800">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-indigo-500/20 shadow-2xl flex-shrink-0">
                <img src="/CroPic1778059821805_1.png" alt="Abu Hanjala" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Abu Hanjala</h3>
              <p className="text-indigo-400 font-medium mb-4">Co-Founder & Lead Visionary</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Abu Hanjala brings deep expertise in product design and trading mechanics. His vision for TradingX was to create a flawless, risk-free environment where anyone can learn the art of trading.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center bg-gray-900/40 p-8 rounded-3xl border border-gray-800">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-cyan-500/20 shadow-2xl flex-shrink-0">
                <img src="/IMG-20260710-WA0009.jpg" alt="Faijan Alam" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Faijan Alam</h3>
              <p className="text-cyan-400 font-medium mb-4">Co-Founder & Technical Lead</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Faijan Alam engineered the robust backend and seamless user experience of the platform. He focuses on delivering high-performance, secure, and highly scalable fintech applications.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}