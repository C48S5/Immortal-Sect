import { describe, it, expect } from 'vitest';
import Decimal from 'break_infinity.js';
import { D, formatNumber, bulkCost, maxAffordable } from '@core/BigNumber';

describe('BigNumber', () => {
  describe('formatNumber', () => {
    it('should format 0 as "0"', () => {
      expect(formatNumber(D(0))).toBe('0');
    });

    it('should format 999 as "999"', () => {
      expect(formatNumber(D(999))).toBe('999');
    });

    it('should format 1000 as "1K"', () => {
      expect(formatNumber(D(1000))).toBe('1K');
    });

    it('should format 1500 as "1.5K"', () => {
      expect(formatNumber(D(1500))).toBe('1.5K');
    });

    it('should format 1000000 as "1M"', () => {
      expect(formatNumber(D(1000000))).toBe('1M');
    });

    it('should format 1e9 as "1B"', () => {
      expect(formatNumber(D(1e9))).toBe('1B');
    });

    it('should format 1e12 as "1T"', () => {
      expect(formatNumber(D(1e12))).toBe('1T');
    });

    it('should format 1e15 as "1Qa"', () => {
      expect(formatNumber(D(1e15))).toBe('1Qa');
    });

    it('should format 1e18 as "1Qi"', () => {
      expect(formatNumber(D(1e18))).toBe('1Qi');
    });

    it('should format numbers below 1K as integers', () => {
      expect(formatNumber(D(500))).toBe('500');
      expect(formatNumber(D(1))).toBe('1');
      expect(formatNumber(D(42))).toBe('42');
    });

    it('should handle fractional numbers below 1K by flooring', () => {
      expect(formatNumber(D(99.9))).toBe('99');
    });

    it('should handle negative numbers', () => {
      const result = formatNumber(D(-1500));
      expect(result).toBe('-1.5K');
    });

    it('should format 1234567 as "1.23M"', () => {
      expect(formatNumber(D(1234567))).toBe('1.23M');
    });

    it('should format 10500 as "10.5K"', () => {
      expect(formatNumber(D(10500))).toBe('10.5K');
    });

    it('should format 100000 as "100K"', () => {
      expect(formatNumber(D(100000))).toBe('100K');
    });
  });

  describe('bulkCost', () => {
    it('should return baseCost for buying 1 with 0 owned', () => {
      const cost = bulkCost(D(4), 1.07, 0, 1);
      expect(cost.toNumber()).toBeCloseTo(4, 5);
    });

    it('should return 0 for buying 0', () => {
      const cost = bulkCost(D(4), 1.07, 0, 0);
      expect(cost.toNumber()).toBe(0);
    });

    it('should return 0 for negative buying count', () => {
      const cost = bulkCost(D(4), 1.07, 0, -5);
      expect(cost.toNumber()).toBe(0);
    });

    it('should match sum of individual costs for buying 10 from 0 owned', () => {
      const base = 4;
      const coeff = 1.07;
      // Sum of base * coeff^i for i=0..9
      let expectedSum = 0;
      for (let i = 0; i < 10; i++) {
        expectedSum += base * Math.pow(coeff, i);
      }
      const result = bulkCost(D(base), coeff, 0, 10);
      expect(result.toNumber()).toBeCloseTo(expectedSum, 2);
    });

    it('should match sum of individual costs for buying 10 from 5 owned', () => {
      const base = 4;
      const coeff = 1.07;
      let expectedSum = 0;
      for (let i = 5; i < 15; i++) {
        expectedSum += base * Math.pow(coeff, i);
      }
      const result = bulkCost(D(base), coeff, 5, 10);
      expect(result.toNumber()).toBeCloseTo(expectedSum, 2);
    });

    it('should handle coefficient of 1 (linear cost)', () => {
      const cost = bulkCost(D(10), 1, 0, 5);
      expect(cost.toNumber()).toBe(50);
    });
  });

  describe('maxAffordable', () => {
    it('should return correct count for budget of 100 with baseCost=4, coeff=1.07', () => {
      const count = maxAffordable(D(4), 1.07, 0, D(100));
      // Verify: the cost of buying `count` should be <= 100
      const costForCount = bulkCost(D(4), 1.07, 0, count);
      expect(costForCount.lte(D(100))).toBe(true);
      // And buying count+1 should exceed 100
      const costForNext = bulkCost(D(4), 1.07, 0, count + 1);
      expect(costForNext.gt(D(100))).toBe(true);
    });

    it('should return 0 when budget is less than the cost of 1', () => {
      const count = maxAffordable(D(4), 1.07, 0, D(3));
      expect(count).toBe(0);
    });

    it('should return 1 when budget exactly affords 1 unit', () => {
      const count = maxAffordable(D(4), 1.07, 0, D(4));
      expect(count).toBe(1);
    });

    it('should account for already owned units', () => {
      const countFrom0 = maxAffordable(D(4), 1.07, 0, D(1000));
      const countFrom50 = maxAffordable(D(4), 1.07, 50, D(1000));
      // From 50 owned, each unit is more expensive, so fewer affordable
      expect(countFrom50).toBeLessThan(countFrom0);
    });

    it('should handle very large budgets', () => {
      const count = maxAffordable(D(4), 1.07, 0, D(1e15));
      expect(count).toBeGreaterThan(0);
      // Verify the answer is correct
      const costForCount = bulkCost(D(4), 1.07, 0, count);
      expect(costForCount.lte(D(1e15))).toBe(true);
    });
  });
});
