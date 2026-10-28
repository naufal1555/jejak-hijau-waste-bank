import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CarbonDashboard from './modules/impact/CarbonDashboard';
import WasteDepositForm from './modules/deposit/WasteDepositForm';
import LedgerTable from './modules/ledger/LedgerTable';
import MemberList from './modules/members/MemberList';
import { StorageService } from './services/storageService';

export default function App() {
  const [activeTab, setActiveTab] = useState('impact');
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Initialize and load storage state
  const loadState = () => {
    StorageService.init();
    setMembers(StorageService.getMembers());
    setTransactions(StorageService.getTransactions());
  };

  useEffect(() => {
    loadState();
  }, []);

  const handleResetSeed = () => {
    if (window.confirm('Reset database ke 200+ transaksi historis simulasi standar?')) {
      const seed = StorageService.resetToSeed();
      setMembers(seed.members);
      setTransactions(seed.transactions);
    }
  };

  const handleDepositSuccess = (memberId, items, notes) => {
    StorageService.addDeposit(memberId, items, notes);
    loadState();
  };

  const handleWithdrawSuccess = (memberId, amount, notes) => {
    StorageService.addWithdrawal(memberId, amount, notes);
    loadState();
  };

  const handleAddMember = (memberData) => {
    StorageService.addMember(memberData);
    loadState();
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar
        onResetSeed={handleResetSeed}
        memberCount={members.length}
        txCount={transactions.length}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'impact' && (
              <CarbonDashboard transactions={transactions} />
            )}

            {activeTab === 'deposit' && (
              <WasteDepositForm
                members={members}
                onDepositSuccess={handleDepositSuccess}
              />
            )}

            {activeTab === 'ledger' && (
              <LedgerTable
                transactions={transactions}
                members={members}
                onWithdrawSuccess={handleWithdrawSuccess}
              />
            )}

            {activeTab === 'members' && (
              <MemberList
                members={members}
                onAddMember={handleAddMember}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
