/**
 * Persistent Client-Side Storage Service for Jejak Hijau PWA
 * Author: Ahmad Fathin Naufal (UGM) - Fullstack Developer
 */

import { generateSeedTransactions } from './dataSeeder';
import { calculateDepositTotal, calculateCarbonOffset } from './impactEngine';

const STORAGE_KEYS = {
  MEMBERS: 'jejak_hijau_members_v1',
  TRANSACTIONS: 'jejak_hijau_transactions_v1',
  INITIALIZED: 'jejak_hijau_initialized_v1'
};

export class StorageService {
  static init() {
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInit) {
      this.resetToSeed();
    }
  }

  static resetToSeed() {
    const seed = generateSeedTransactions();
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(seed.members));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(seed.transactions));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    return seed;
  }

  static getMembers() {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static getTransactions() {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static addMember(member) {
    const members = this.getMembers();
    const newMember = {
      ...member,
      id: `MBR-${String(members.length + 1).padStart(3, '0')}`,
      joinedAt: new Date().toISOString().substring(0, 10),
      currentBalance: 0
    };
    members.unshift(newMember);
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    return newMember;
  }

  static addDeposit(memberId, items, notes = '') {
    const members = this.getMembers();
    const transactions = this.getTransactions();

    const memberIndex = members.findIndex(m => m.id === memberId);
    if (memberIndex === -1) throw new Error('Member not found');

    const totalVal = calculateDepositTotal(items);
    const co2e = calculateCarbonOffset(items);
    const totalWeight = Number(items.reduce((acc, it) => acc + Number(it.weightKg), 0).toFixed(2));

    members[memberIndex].currentBalance += totalVal;

    const newTx = {
      id: `TX-${String(transactions.length + 1).padStart(5, '0')}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      memberId: memberId,
      memberName: members[memberIndex].name,
      type: 'DEPOSIT',
      items: items,
      totalWeightKg: totalWeight,
      amount: totalVal,
      co2eOffset: co2e,
      balanceAfter: members[memberIndex].currentBalance,
      notes: notes || 'Setoran sampah nasabah'
    };

    transactions.unshift(newTx);
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    return { transaction: newTx, member: members[memberIndex] };
  }

  static addWithdrawal(memberId, amount, notes = '') {
    const members = this.getMembers();
    const transactions = this.getTransactions();

    const memberIndex = members.findIndex(m => m.id === memberId);
    if (memberIndex === -1) throw new Error('Member not found');

    if (members[memberIndex].currentBalance < amount) {
      throw new Error('Saldo nasabah tidak mencukupi untuk penarikan.');
    }

    members[memberIndex].currentBalance -= amount;

    const newTx = {
      id: `TX-${String(transactions.length + 1).padStart(5, '0')}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      memberId: memberId,
      memberName: members[memberIndex].name,
      type: 'WITHDRAWAL',
      items: [],
      totalWeightKg: 0,
      amount: amount,
      co2eOffset: 0,
      balanceAfter: members[memberIndex].currentBalance,
      notes: notes || 'Tarik saldo tunai nasabah'
    };

    transactions.unshift(newTx);
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    return { transaction: newTx, member: members[memberIndex] };
  }
}
