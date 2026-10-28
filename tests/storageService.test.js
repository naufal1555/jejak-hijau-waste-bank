import { describe, it, expect } from 'vitest';
import { generateSeedTransactions } from '../src/services/dataSeeder.js';

describe('Data Seeder and Transaction Generation Tests', () => {
  it('should generate at least 200 transactions to strictly fulfill the CV claim', () => {
    const seed = generateSeedTransactions();
    expect(seed.transactions.length).toBeGreaterThanOrEqual(200);
    expect(seed.members.length).toBeGreaterThanOrEqual(20);
  });

  it('should ensure all transactions have non-negative balances and valid timestamps', () => {
    const seed = generateSeedTransactions();
    seed.transactions.forEach((tx) => {
      expect(tx.id).toMatch(/^TX-\d{5}$/);
      expect(tx.amount).toBeGreaterThan(0);
      expect(tx.balanceAfter).toBeGreaterThanOrEqual(0);
      expect(tx.timestamp).toBeDefined();
    });
  });

  it('should verify member balances match net deposits minus withdrawals', () => {
    const seed = generateSeedTransactions();
    const balanceMap = {};
    seed.members.forEach(m => { balanceMap[m.id] = 0; });

    seed.transactions.forEach((tx) => {
      if (tx.type === 'DEPOSIT') {
        balanceMap[tx.memberId] += tx.amount;
      } else if (tx.type === 'WITHDRAWAL') {
        balanceMap[tx.memberId] -= tx.amount;
      }
    });

    seed.members.forEach((m) => {
      expect(m.currentBalance).toBe(balanceMap[m.id]);
    });
  });
});
