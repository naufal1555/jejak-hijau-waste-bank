import React from 'react';
import { Leaf, RefreshCw, UserCheck, ShieldCheck } from 'lucide-react';

export default function Navbar({ onResetSeed, memberCount, txCount }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="bg-forest-600/20 text-forest-500 p-2.5 rounded-xl border border-forest-500/30">
            <Leaf className="w-6 h-6 text-forest-500" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white tracking-tight">Jejak Hijau</h1>
              <span className="text-xs bg-forest-500/20 text-forest-400 font-semibold px-2 py-0.5 rounded-full border border-forest-500/30">
                PWA v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">Digital Community Waste Bank & Carbon Offset Tracker</p>
          </div>
        </div>

        {/* Stats Badges & Author Info */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-3 text-xs bg-slate-800/80 px-3.5 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400">Nasabah: <strong className="text-white">{memberCount}</strong></span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Transaksi: <strong className="text-forest-400">{txCount}+</strong></span>
          </div>

          <div className="hidden lg:flex items-center space-x-2 text-xs bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 px-3 py-1.5 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Candidate: <strong>Ahmad Fathin Naufal</strong> (UGM)</span>
          </div>

          <button
            onClick={onResetSeed}
            title="Reset database to 200+ standard simulated transactions"
            className="flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Data (200+ Tx)</span>
          </button>
        </div>
      </div>
    </header>
  );
}
