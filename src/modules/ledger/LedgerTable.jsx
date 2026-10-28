import React, { useState } from 'react';
import { BookOpenCheck, ArrowDownLeft, ArrowUpRight, Search, Download, DollarSign, X } from 'lucide-react';

export default function LedgerTable({ transactions, members, onWithdrawSuccess }) {
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawNotes, setWithdrawNotes] = useState('');
  const [withdrawError, setWithdrawError] = useState('');

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    const matchesType = filterType === 'ALL' || tx.type === filterType;
    const matchesSearch =
      tx.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      setWithdrawError('Masukkan nominal penarikan valid.');
      return;
    }

    try {
      onWithdrawSuccess(selectedMemberId, amount, withdrawNotes);
      setIsWithdrawModalOpen(false);
      setWithdrawAmount('');
      setWithdrawNotes('');
      setWithdrawError('');
    } catch (err) {
      setWithdrawError(err.message || 'Gagal melakukan penarikan saldo.');
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Member ID', 'Member Name', 'Type', 'Weight Kg', 'Amount IDR', 'CO2e Offset Kg', 'Balance After IDR', 'Notes'];
    const rows = transactions.map(t => [
      t.id,
      t.timestamp,
      t.memberId,
      `"${t.memberName}"`,
      t.type,
      t.totalWeightKg,
      t.amount,
      t.co2eOffset,
      t.balanceAfter,
      `"${t.notes.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jejak_hijau_transactions_audit_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header and Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <BookOpenCheck className="w-6 h-6 text-forest-400" />
            <span>Buku Besar Tabungan Nasabah</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Total {transactions.length} mutasi setoran sampah dan penarikan tunai tercatat.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-forest-600 hover:bg-forest-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
          >
            <DollarSign className="w-4 h-4" />
            <span>Tarik Tunai Saldo</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-700 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          {['ALL', 'DEPOSIT', 'WITHDRAWAL'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterType === type
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type === 'ALL' ? 'Semua Mutasi' : (type === 'DEPOSIT' ? 'Setoran Masuk' : 'Penarikan')}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Cari transaksi / nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-forest-500"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto max-h-[560px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-950/80 sticky top-0 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">ID Transaksi</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Nasabah</th>
                <th className="py-3 px-4">Tipe</th>
                <th className="py-3 px-4 text-right">Berat Sampah</th>
                <th className="py-3 px-4 text-right">Nominal (IDR)</th>
                <th className="py-3 px-4 text-right">Offset Karbon</th>
                <th className="py-3 px-4 text-right">Saldo Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-300">{tx.id}</td>
                  <td className="py-3 px-4 text-slate-400">{tx.timestamp}</td>
                  <td className="py-3 px-4 font-medium text-white">{tx.memberName}</td>
                  <td className="py-3 px-4">
                    {tx.type === 'DEPOSIT' ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-400 font-semibold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                        <ArrowDownLeft className="w-3 h-3" />
                        <span>Setoran</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-amber-400 font-semibold bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                        <ArrowUpRight className="w-3 h-3" />
                        <span>Tarik Tunai</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300 font-mono">
                    {tx.totalWeightKg > 0 ? `${tx.totalWeightKg.toFixed(2)} kg` : '-'}
                  </td>
                  <td className={`py-3 px-4 text-right font-semibold font-mono ${
                    tx.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {tx.type === 'DEPOSIT' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-300">
                    {tx.co2eOffset > 0 ? `+${tx.co2eOffset.toFixed(2)} kg` : '-'}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-white font-mono">
                    Rp {tx.balanceAfter.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsWithdrawModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-2">Formulir Penarikan Saldo</h3>
            <p className="text-xs text-slate-400 mb-4">Cairkan saldo tabungan nasabah hasil pemilahan sampah.</p>

            {withdrawError && (
              <div className="bg-rose-950/80 border border-rose-600 text-rose-300 text-xs p-3 rounded-xl mb-4">
                {withdrawError}
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Pilih Nasabah</label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (Tersedia: Rp {m.currentBalance?.toLocaleString('id-ID')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nominal Penarikan (IDR)</label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  placeholder="Contoh: 25000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Keperluan / Keterangan</label>
                <input
                  type="text"
                  placeholder="Contoh: Penarikan berkala uang belanja sayur"
                  value={withdrawNotes}
                  onChange={(e) => setWithdrawNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-forest-600 hover:bg-forest-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
                >
                  Konfirmasi Penarikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
