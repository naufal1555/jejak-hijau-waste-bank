import React from 'react';
import { calculateAggregateStats, WASTE_CATEGORIES } from '../../services/impactEngine';
import { CloudRain, Trees, Scale, Coins, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function CarbonDashboard({ transactions }) {
  const stats = calculateAggregateStats(transactions);

  return (
    <div className="space-y-6">
      {/* Hero Impact Header */}
      <div className="bg-gradient-to-r from-forest-900/60 via-slate-900 to-slate-900 border border-forest-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 bg-forest-500/20 text-forest-400 text-xs px-2.5 py-1 rounded-full font-semibold mb-3 border border-forest-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ESG & Real-time Circular Economy Metrics</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Pelacak Jejak Karbon Komunitas
          </h2>
          <p className="text-slate-300 text-sm mt-1.5 leading-relaxed">
            Memonitor agregasi reduksi gas rumah kaca ($CO_2e$) dan sirkulasi ekonomi riil dari hasil pemilahan sampah anorganik dan organik tingkat komunitas.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sampah */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Sampah Terkumpul</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {stats.totalWasteCollectedKg.toLocaleString('id-ID')} <span className="text-sm font-normal text-slate-400">kg</span>
          </div>
          <div className="mt-2 text-xs text-blue-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>5 Fraksi Terpilah</span>
          </div>
        </div>

        {/* Emisi CO2e */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Reduksi Emisi CO₂e</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <CloudRain className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">
            {stats.totalCo2eAvoidedKg.toLocaleString('id-ID')} <span className="text-sm font-normal text-slate-400">kg CO₂e</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Mencegah dekomposisi metana TPA
          </div>
        </div>

        {/* Pohon */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Ekuivalen Penanaman</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Trees className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400 tracking-tight">
            {stats.treeEquivalentCount.toLocaleString('id-ID')} <span className="text-sm font-normal text-slate-400">Pohon / Thn</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Basis serapan: 21.77 kg/pohon
          </div>
        </div>

        {/* Nilai Ekonomi */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Perputaran Tabungan</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-400 tracking-tight">
            Rp {stats.totalDepositValueIdr.toLocaleString('id-ID')}
          </div>
          <div className="mt-2 text-xs text-purple-300 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Disalurkan ke saldo nasabah</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Breakdown */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4">Distribusi Material & Kontribusi Reduksi Karbon</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(WASTE_CATEGORIES).map(([key, cat]) => {
            const weight = stats.categoryBreakdown[key] || 0;
            const pct = stats.totalWasteCollectedKg > 0 ? ((weight / stats.totalWasteCollectedKg) * 100).toFixed(1) : 0;
            const co2Contribution = (weight * cat.co2ePerKg).toFixed(1);

            return (
              <div key={key} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">{cat.name.split(' ')[0]}</span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                      {pct}%
                    </span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {weight.toFixed(1)} <span className="text-xs font-normal text-slate-400">kg</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Harga: Rp {cat.pricePerKg.toLocaleString('id-ID')}/kg
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs">
                  <span className="text-slate-500">Offset: </span>
                  <strong className="text-emerald-400">{co2Contribution} kg CO₂e</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
