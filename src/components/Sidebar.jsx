import React from 'react';
import { LayoutDashboard, Scale, BookOpenCheck, Users, Info } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'impact', label: 'Dampak & Karbon', icon: LayoutDashboard, desc: 'ESG & Offset CO2e' },
    { id: 'deposit', label: 'Setoran Sampah', icon: Scale, desc: 'Penimbangan & Kasir' },
    { id: 'ledger', label: 'Buku Tabungan', icon: BookOpenCheck, desc: 'Audit Mutasi & Tarik' },
    { id: 'members', label: 'Data Nasabah', icon: Users, desc: 'Kelola Anggota' },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-73px)]">
      <div className="space-y-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">Modul Operasional</p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-start space-x-3 px-3.5 py-3 rounded-xl text-left transition ${
                    isActive
                      ? 'bg-forest-600/20 text-forest-400 border border-forest-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${isActive ? 'text-forest-400' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-sm font-semibold leading-tight">{item.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Methodology Card */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-400">
          <div className="flex items-center space-x-1.5 text-forest-400 font-semibold mb-1.5">
            <Info className="w-4 h-4" />
            <span>Formula IPCC / EPA</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            Tiap kg plastik daur ulang mencegah <strong className="text-slate-200">1.85 kg CO₂e</strong> emisi gas rumah kaca ke atmosfer.
          </p>
        </div>
      </div>

      {/* Candidate Footer */}
      <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
        <p className="font-semibold text-slate-400">Ahmad Fathin Naufal</p>
        <p>Internet Engineering Technology</p>
        <p className="text-forest-500">Universitas Gadjah Mada</p>
      </div>
    </aside>
  );
}
