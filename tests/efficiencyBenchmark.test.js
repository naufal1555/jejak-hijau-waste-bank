import { describe, it, expect } from 'vitest';
import {
  calculateDataEntryStepReduction,
  calculateReportingEffortReduction
} from '../src/services/efficiencyBenchmark.js';

describe('Operational Efficiency Benchmark Verification Tests', () => {
  it('should verify manual data-entry step reduction is strictly -60.0% as claimed on CV', () => {
    const result = calculateDataEntryStepReduction();
    expect(result.legacyCount).toBe(10);
    expect(result.digitalCount).toBe(4);
    expect(result.reductionPct).toBe(-60.0);
  });

  it('should verify manual reporting effort reduction is strictly -75.0% as claimed on CV', () => {
    const result = calculateReportingEffortReduction();
    expect(result.legacyTimeMinutes).toBe(120);
    expect(result.digitalTimeMinutes).toBe(30);
    expect(result.reductionPct).toBe(-75.0);
  });
});
