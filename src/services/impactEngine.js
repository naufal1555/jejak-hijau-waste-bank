/**
 * Environmental Impact & Recyclable Material Economics Engine
 * Author: Ahmad Fathin Naufal (UGM) - Fullstack Developer
 */

export const WASTE_CATEGORIES = {
  PLASTIK: {
    id: 'PLASTIK',
    name: 'Plastik (PET/HDPE/PP)',
    pricePerKg: 3500, // IDR per kg
    co2ePerKg: 1.85,  // kg CO2e avoided per kg recycled (IPCC benchmark)
    color: '#3b82f6',
    icon: 'Recycle'
  },
  KERTAS: {
    id: 'KERTAS',
    name: 'Kertas & Karton Duplek',
    pricePerKg: 2200,
    co2ePerKg: 1.15,
    color: '#eab308',
    icon: 'FileText'
  },
  LOGAM: {
    id: 'LOGAM',
    name: 'Logam (Aluminium/Besi/Tembaga)',
    pricePerKg: 8500,
    co2ePerKg: 4.20,
    color: '#64748b',
    icon: 'Wrench'
  },
  KACA: {
    id: 'KACA',
    name: 'Kaca & Botol Beling',
    pricePerKg: 1200,
    co2ePerKg: 0.35,
    color: '#06b6d4',
    icon: 'Wine'
  },
  ORGANIK: {
    id: 'ORGANIK',
    name: 'Organik (Sisa Makanan/Kompos)',
    pricePerKg: 800,
    co2ePerKg: 0.50,
    color: '#22c55e',
    icon: 'Sprout'
  }
};

/**
 * Annual urban tree carbon sequestration constant (kg CO2 absorbed / tree / year)
 */
export const TREE_ANNUAL_ABSORPTION_KG = 21.77;

/**
 * Calculates total valuation for a batch of waste deposit items
 * @param {Array<{category: string, weightKg: number}>} items
 * @returns {number} IDR
 */
export function calculateDepositTotal(items) {
  if (!items || !items.length) return 0;
  return items.reduce((total, item) => {
    const cat = WASTE_CATEGORIES[item.category];
    const price = cat ? cat.pricePerKg : 0;
    return total + (Number(item.weightKg) || 0) * price;
  }, 0);
}

/**
 * Calculates net CO2e greenhouse gas avoided for deposited items
 * @param {Array<{category: string, weightKg: number}>} items
 * @returns {number} kg CO2e
 */
export function calculateCarbonOffset(items) {
  if (!items || !items.length) return 0;
  const netCo2 = items.reduce((total, item) => {
    const cat = WASTE_CATEGORIES[item.category];
    const factor = cat ? cat.co2ePerKg : 0;
    return total + (Number(item.weightKg) || 0) * factor;
  }, 0);
  return Number(netCo2.toFixed(2));
}

/**
 * Converts net CO2e reduction to tree planting credit equivalence
 * @param {number} co2eKg
 * @returns {number} Tree credits
 */
export function calculateTreeEquivalence(co2eKg) {
  if (!co2eKg || co2eKg <= 0) return 0;
  return Number((co2eKg / TREE_ANNUAL_ABSORPTION_KG).toFixed(2));
}

/**
 * Calculates platform-wide aggregate operational stats
 * @param {Array} transactions
 */
export function calculateAggregateStats(transactions) {
  let totalKg = 0;
  let totalIdr = 0;
  let totalCo2e = 0;
  const categoryBreakdown = {
    PLASTIK: 0,
    KERTAS: 0,
    LOGAM: 0,
    KACA: 0,
    ORGANIK: 0
  };

  transactions.forEach((tx) => {
    if (tx.type === 'DEPOSIT' && tx.items) {
      tx.items.forEach((item) => {
        const wt = Number(item.weightKg) || 0;
        totalKg += wt;
        if (categoryBreakdown[item.category] !== undefined) {
          categoryBreakdown[item.category] += wt;
        }
      });
      totalIdr += Number(tx.amount) || 0;
      totalCo2e += Number(tx.co2eOffset) || 0;
    }
  });

  return {
    totalWasteCollectedKg: Number(totalKg.toFixed(2)),
    totalDepositValueIdr: totalIdr,
    totalCo2eAvoidedKg: Number(totalCo2e.toFixed(2)),
    treeEquivalentCount: calculateTreeEquivalence(totalCo2e),
    categoryBreakdown
  };
}
