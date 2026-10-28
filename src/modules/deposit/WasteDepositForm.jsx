import React, { useState } from 'react';
import { WASTE_CATEGORIES, calculateDepositTotal, calculateCarbonOffset } from '../../services/impactEngine';
import { Scale, Plus, Trash2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function WasteDepositForm({ members, onDepositSuccess }) {
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');
  const [items, setItems] = useState([
    { category: 'PLASTIK', weightKg: '' }
  ]);
  const [notes, setNotes] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);

  const addItemRow = () => {
    setItems([...items, { category: 'KERTAS', weightKg: '' }]);
  };

  const removeItemRow = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const totalAmount = calculateDepositTotal(items);
  const totalCo2e = calculateCarbonOffset(items);
  const totalWeight = items.reduce((acc, it) => acc + (Number(it.weightKg) || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMemberId) {
      setStatusMsg({ type: 'error', text: 'Pilih nasabah terlebih dahulu.' });
      return;
    }

    const validItems = items.filter(it => Number(it.weightKg) > 0);
    if (!validItems.length) {
      setStatusMsg({ type: 'error', text: 'Masukkan minimal satu jenis sampah dengan berat valid (>0 kg).' });
      return;
    }

    try {
      onDepositSuccess(selectedMemberId, validItems, notes);
      setStatusMsg({
        type: 'success',
        text: `Setoran sukses dicatat! Saldo Rp ${totalAmount.toLocaleString('id-ID')} ditambahkan ke nasabah.`
      });
      // Reset form
      setItems([{ category: 'PLASTIK', weightKg: '' }]);
      setNotes('');
      setTimeout(() => setStatusMsg(null), 5000);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Gagal menyimpan transaksi.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-forest-600/20 text-forest-400 rounded-xl border border-forest-500/30">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Kasir Penimbangan Sampah</h2>
            <p className="text-xs text-slate-400">Catat penerimaan sampah nasabah, kalkulasi nilai tunai, dan rekam jejak karbon.</p>
          </div>
        </div>

        {statusMsg && (
          <div className={`p-4 rounded-xl text-sm mb-6 flex items-center space-x-2.5 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-950/70 border border-emerald-600/50 text-emerald-300'
              : 'bg-rose-950/70 border border-rose-600/50 text-rose-300'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Member Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Pilih Nasabah Bank Sampah
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-forest-500 transition"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} - {m.name} (Saldo: Rp {m.currentBalance?.toLocaleString('id-ID')}) - {m.address}
                </option>
              ))}
            </select>
          </div>

          {/* Waste Items Rows */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Daftar Barang Sampah Disetor
              </label>
              <button
                type="button"
                onClick={addItemRow}
                className="inline-flex items-center space-x-1.5 text-xs text-forest-400 hover:text-forest-300 font-semibold transition"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Fraksi Sampah</span>
              </button>
            </div>

            {items.map((item, index) => {
              const cat = WASTE_CATEGORIES[item.category];
              const subtotal = (Number(item.weightKg) || 0) * (cat ? cat.pricePerKg : 0);
              const co2Sub = (Number(item.weightKg) || 0) * (cat ? cat.co2ePerKg : 0);

              return (
                <div key={index} className="grid grid-cols-12 gap-3 items-center bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  {/* Category */}
                  <div className="col-span-12 sm:col-span-5">
                    <select
                      value={item.category}
                      onChange={(e) => updateItem(index, 'category', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-forest-500"
                    >
                      {Object.entries(WASTE_CATEGORIES).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v.name} (Rp {v.pricePerKg.toLocaleString('id-ID')}/kg)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Weight */}
                  <div className="col-span-6 sm:col-span-3">
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Berat (kg)"
                        value={item.weightKg}
                        onChange={(e) => updateItem(index, 'weightKg', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-100 focus:outline-none focus:border-forest-500"
                      />
                      <span className="absolute right-2.5 top-2 text-[11px] text-slate-400">kg</span>
                    </div>
                  </div>

                  {/* Subtotal & CO2 */}
                  <div className="col-span-5 sm:col-span-3 text-right">
                    <div className="text-xs font-bold text-white">Rp {subtotal.toLocaleString('id-ID')}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">+{co2Sub.toFixed(2)} kg CO₂e</div>
                  </div>

                  {/* Delete */}
                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => removeItemRow(index)}
                      disabled={items.length <= 1}
                      className="text-slate-500 hover:text-rose-400 disabled:opacity-30 transition p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Catatan / Lokasi Pengambilan (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Pemilahan botol air mineral kegiatan kerja bakti RT"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-forest-500"
            />
          </div>

          {/* Live Valuation Summary Box */}
          <div className="bg-slate-950 border border-forest-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400">Estimasi Total Berat</div>
              <div className="text-lg font-bold text-white">{totalWeight.toFixed(2)} kg</div>
            </div>

            <div>
              <div className="text-xs text-slate-400">Pencegahan Emisi CO₂e</div>
              <div className="text-lg font-bold text-emerald-400 flex items-center space-x-1">
                <Sparkles className="w-4 h-4" />
                <span>{totalCo2e.toFixed(2)} kg CO₂e</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Total Nominal Saldo</div>
              <div className="text-xl font-bold text-forest-400">Rp {totalAmount.toLocaleString('id-ID')}</div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-forest-600 hover:bg-forest-500 text-white font-bold py-3.5 px-6 rounded-xl transition duration-200 shadow-lg shadow-forest-600/20 text-sm"
          >
            Simpan Setoran & Update Saldo Nasabah
          </button>
        </form>
      </div>
    </div>
  );
}
