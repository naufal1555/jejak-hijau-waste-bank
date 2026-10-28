import { describe, it, expect } from 'vitest';
import {
  calculateDepositTotal,
  calculateCarbonOffset,
  calculateTreeEquivalence,
  calculateAggregateStats,
  WASTE_CATEGORIES
} from '../src/services/impactEngine.js';

describe('Environmental Impact Engine Tests', () => {
  it('should correctly calculate deposit value based on unit prices', () => {
    const items = [
      { category: 'PLASTIK', weightKg: 10 }, // 10 * 3500 = 35,000
      { category: 'LOGAM', weightKg: 2 },    // 2 * 8500 = 17,000
    ];
    const total = calculateDepositTotal(items);
    expect(total).toBe(52000);
  });

  it('should correctly calculate net CO2e greenhouse gas avoided', () => {
    const items = [
      { category: 'PLASTIK', weightKg: 10 }, // 10 * 1.85 = 18.5
      { category: 'KERTAS', weightKg: 20 },  // 20 * 1.15 = 23.0
    ];
    const co2 = calculateCarbonOffset(items);
    expect(co2).toBe(41.5);
  });

  it('should convert CO2e to accurate tree planting credits', () => {
    // 21.77 kg CO2 / tree
    const co2e = 43.54;
    const trees = calculateTreeEquivalence(co2e);
    expect(trees).toBe(2.0);
  });

  it('should aggregate multi-transaction statistics accurately', () => {
    const mockTxs = [
      {
        type: 'DEPOSIT',
        amount: 25000,
        co2eOffset: 15.0,
        items: [{ category: 'PLASTIK', weightKg: 5 }]
      },
      {
        type: 'DEPOSIT',
        amount: 30000,
        co2eOffset: 20.0,
        items: [{ category: 'KERTAS', weightKg: 10 }]
      },
      {
        type: 'WITHDRAWAL',
        amount: 15000,
        co2eOffset: 0,
        items: []
      }
    ];

    const agg = calculateAggregateStats(mockTxs);
    expect(agg.totalWasteCollectedKg).toBe(15.0);
    expect(agg.totalDepositValueIdr).toBe(55000);
    expect(agg.totalCo2eAvoidedKg).toBe(35.0);
    expect(agg.categoryBreakdown.PLASTIK).toBe(5);
    expect(agg.categoryBreakdown.KERTAS).toBe(10);
  });
});
