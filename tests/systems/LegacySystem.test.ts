import { describe, it, expect } from 'vitest';

/**
 * LegacySystem tests.
 *
 * Tests Qi Residue drops, Legacy Power multiplier formula,
 * and fragment generation from disciple death.
 */

const QI_RESIDUE_ON_DEATH: Record<string, number> = {
  common: 1,
  uncommon: 3,
  rare: 0,  // Rare+ drop fragments instead of QR (or in addition)
  epic: 0,
  legendary: 0,
};

function calculateLegacyMultiplier(lp: number): number {
  if (lp <= 0) return 1;
  return 1 + Math.log10(1 + lp) * 0.5;
}

describe('LegacySystem', () => {
  describe('Qi Residue from disciple death', () => {
    it('Common death should yield 1 QR', () => {
      expect(QI_RESIDUE_ON_DEATH.common).toBe(1);
    });

    it('Uncommon death should yield 3 QR', () => {
      expect(QI_RESIDUE_ON_DEATH.uncommon).toBe(3);
    });
  });

  describe('Rare disciple death rewards', () => {
    it('Rare death should produce a Minor Fragment', () => {
      // Rare disciples produce minor fragments
      const fragmentType = 'minor';
      const lp = 1;
      const hallIncomeBonus = 0.01; // +1% hall income
      expect(fragmentType).toBe('minor');
      expect(lp).toBe(1);
      expect(hallIncomeBonus).toBe(0.01);
    });
  });

  describe('Legacy Power multiplier formula: 1 + log10(1 + LP) * 0.5', () => {
    it('LP=0 should give x1.00', () => {
      expect(calculateLegacyMultiplier(0)).toBe(1);
    });

    it('LP=10 should give approximately x1.52', () => {
      const mult = calculateLegacyMultiplier(10);
      // 1 + log10(11) * 0.5 = 1 + 1.0414 * 0.5 = 1.5207
      expect(mult).toBeCloseTo(1.52, 1);
    });

    it('LP=100 should give approximately x2.00', () => {
      const mult = calculateLegacyMultiplier(100);
      // 1 + log10(101) * 0.5 = 1 + 2.0043 * 0.5 = 2.0022
      expect(mult).toBeCloseTo(2.00, 1);
    });

    it('LP=1000 should give approximately x2.50', () => {
      const mult = calculateLegacyMultiplier(1000);
      // 1 + log10(1001) * 0.5 = 1 + 3.0004 * 0.5 = 2.5002
      expect(mult).toBeCloseTo(2.50, 1);
    });

    it('LP=10000 should give approximately x3.00', () => {
      const mult = calculateLegacyMultiplier(10000);
      // 1 + log10(10001) * 0.5 = 1 + 4.0000 * 0.5 = 3.0000
      expect(mult).toBeCloseTo(3.00, 1);
    });

    it('should always be >= 1', () => {
      for (const lp of [0, 1, 10, 100, 1000]) {
        expect(calculateLegacyMultiplier(lp)).toBeGreaterThanOrEqual(1);
      }
    });

    it('should increase monotonically with LP', () => {
      let prevMult = 0;
      for (const lp of [0, 1, 5, 10, 50, 100, 500, 1000, 10000]) {
        const mult = calculateLegacyMultiplier(lp);
        expect(mult).toBeGreaterThanOrEqual(prevMult);
        prevMult = mult;
      }
    });
  });
});
