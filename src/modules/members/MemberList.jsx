import React, { useState } from 'react';
import { Users, UserPlus, Search, Phone, MapPin, CreditCard, X } from 'lucide-react';

export default function MemberList({ members, onAddMember }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    nik: '',
    address: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.nik.includes(searchQuery) ||
    m.phone.includes(searchQuery) ||
    m.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.nik.trim()) {
      setErrorMsg('Semua kolom wajib diisi.');
      return;
    }

    try {
      onAddMember(formData);
      setIsAddModalOpen(false);
      setFormData({ name: '', phone: '', nik: '', address: '' });
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message || 'Gagal menambahkan nasabah.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Users className="w-6 h-6 text-forest-400" />
            <span>Direktori Nasabah Bank Sampah</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Total {members.length} nasabah aktif terdaftar dalam sistem.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-1.5 bg-forest-600 hover:bg-forest-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Daftarkan Nasabah Baru</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
        <input
          type="text"
          placeholder="Cari nama, NIK, atau nomor telepon..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-forest-500"
        />
      </div>

      {/* Grid of Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((m) => (
          <div key={m.id} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-forest-400 bg-forest-950/60 border border-forest-800/40 px-2 py-0.5 rounded">
                  {m.id}
                </span>
                <span className="text-[11px] text-slate-500">Gabung: {m.joinedAt}</span>
              </div>

              <h3 className="text-base font-bold text-white mb-1">{m.name}</h3>

              <div className="space-y-1.5 text-xs text-slate-400 mt-3">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="font-mono text-slate-300">NIK: {m.nik}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{m.phone}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{m.address}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-xs text-slate-400">Saldo Tersimpan</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                Rp {m.currentBalance?.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-2">Pendaftaran Nasabah Baru</h3>
            <p className="text-xs text-slate-400 mb-4">Lengkapi data kependudukan calon nasabah bank sampah.</p>

            {errorMsg && (
              <div className="bg-rose-950/80 border border-rose-600 text-rose-300 text-xs p-3 rounded-xl mb-4">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Ikhsan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor Induk Kependudukan (NIK)</label>
                <input
                  type="text"
                  required
                  placeholder="16 digit NIK KTP"
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor WhatsApp / HP</label>
                <input
                  type="tel"
                  required
                  placeholder="08xxxxxxxxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Alamat RT / RW / Kelurahan</label>
                <textarea
                  rows="2"
                  placeholder="Contoh: RT 03 / RW 04, Pogung Kidul, Sinduadi, Mlati, Sleman"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-forest-600 hover:bg-forest-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
                >
                  Daftarkan Nasabah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
