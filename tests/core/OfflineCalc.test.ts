import { describe, it, expect } from 'vitest';
import Decimal from 'break_infinity.js';
import { D } from '@core/BigNumber';
import {
  calculateOfflineEarnings,
  type OfflineConfig,
} from '@core/OfflineCalc';

function createConfig(overrides: Partial<OfflineConfig> = {}): OfflineConfig {
  return {
    incomePerSecond: D(100),
    lastSaveTime: 0,
    voidMeditationTier: 0,
    tribulation9Complete: false,
    bodyDaoActive: false,
    ...overrides,
  };
}

describe('OfflineCalc', () => {
  describe('calculateOfflineEarnings', () => {
    it('should calculate 8 hours offline at 100 SS/s with base 50% efficiency', () => {
      const config = createConfig({
        incomePerSecond: D(100),
        lastSaveTime: 0,
      });
      const now = 8 * 3600 * 1000; // 8 hours in ms

      const result = calculateOfflineEarnings(config, now);
      // 100 * 28800 * 0.5 = 1,440,000
      expect(result.spiritStones.toNumber()).toBeCloseTo(1440000, 0);
      expect(result.secondsAway).toBe(28800);
      expect(result.efficiency).toBeCloseTo(0.5, 5);
    });

    it('should cap at 72 hours: 80 hours offline should equal 72 hours earnings', () => {
      const config = createConfig({
        incomePerSecond: D(100),
        lastSaveTime: 0,
      });
      const now80h = 80 * 3600 * 1000;
      const now72h = 72 * 3600 * 1000;

      const result80 = calculateOfflineEarnings(config, now80h);
      const result72 = calculateOfflineEarnings(config, now72h);

      expect(result80.spiritStones.toNumber()).toBe(
        result72.spiritStones.toNumber(),
      );
      expect(result80.secondsAway).toBe(72 * 3600);
    });

    it('should apply Void Meditation Sanctum tier 5 for x6 efficiency', () => {
      const config = createConfig({
        incomePerSecond: D(100),
        lastSaveTime: 0,
        voidMeditationTier: 5,
      });
      const now = 8 * 3600 * 1000;

      const result = calculateOfflineEarnings(config, now);
      // 100 * 28800 * (0.5 * 6) = 100 * 28800 * 3.0 = 8,640,000
      expect(result.spiritStones.toNumber()).toBeCloseTo(8640000, 0);
      expect(result.efficiency).toBeCloseTo(3.0, 5);
    });

    it('should apply Body Dao +25% additive to base efficiency', () => {
      const config = createConfig({
        incomePerSecond: D(100),
        lastSaveTime: 0,
        bodyDaoActive: true,
      });
      const now = 8 * 3600 * 1000;

      const result = calculateOfflineEarnings(config, now);
      // Base = 0.5 + 0.25 = 0.75, void tier 0 = x1, trib = x1
      // efficiency = 0.75 * 1 * 1 = 0.75
      // 100 * 28800 * 0.75 = 2,160,000
      expect(result.spiritStones.toNumber()).toBeCloseTo(2160000, 0);
      expect(result.efficiency).toBeCloseTo(0.75, 5);
    });

    it('should combine Body Dao and Void Meditation correctly', () => {
      const config = createConfig({
        incomePerSecond: D(100),
        lastSaveTime: 0,
        bodyDaoActive: true,
        voidMeditationTier: 5,
      });
      const now = 8 * 3600 * 1000;

      const result = calculateOfflineEarnings(config, now);
      // Base = 0.5 + 0.25 = 0.75, void = x6, trib = x1
      // efficiency = 0.75 * 6 = 4.5
      expect(result.efficiency).toBeCloseTo(4.5, 5);
    });

    it('should apply Tribulation Challenge 9 x3 multiplier', () => {
      const config = createConfig({
        incomePerSecond: D(100),
        lastSaveTime: 0,
        tribulation9Complete: true,
      });
      const now = 8 * 3600 * 1000;

      const result = calculateOfflineEarnings(config, now);
      // 0.5 * 1 * 3 = 1.5
      expect(result.efficiency).toBeCloseTo(1.5, 5);
    });

    it('should return 0 earnings when no time has elapsed', () => {
      const config = createConfig({ lastSaveTime: 1000 });
      const result = calculateOfflineEarnings(config, 1000);
      expect(result.spiritStones.toNumber()).toBe(0);
    });

    it('should return 0 earnings when income is 0', () => {
      const config = createConfig({ incomePerSecond: D(0) });
      const result = calculateOfflineEarnings(config, 8 * 3600 * 1000);
      expect(result.spiritStones.toNumber()).toBe(0);
    });

    it('should provide correct multiplier breakdown', () => {
      const config = createConfig({
        voidMeditationTier: 3,
        tribulation9Complete: true,
        bodyDaoActive: true,
      });
      const now = 3600 * 1000;

      const result = calculateOfflineEarnings(config, now);
      expect(result.multiplierBreakdown.base).toBe(0.5);
      expect(result.multiplierBreakdown.voidMeditationBonus).toBe(3);
      expect(result.multiplierBreakdown.tribulationBonus).toBe(3);
      expect(result.multiplierBreakdown.bodyDaoBonus).toBe(0.25);
      // (0.5 + 0.25) * 4 * 3 = 0.75 * 4 * 3 = 9
      expect(result.multiplierBreakdown.totalEfficiency).toBeCloseTo(9, 5);
    });

    it('should clamp void meditation tier to 0-5', () => {
      const config = createConfig({ voidMeditationTier: 10 });
      const now = 3600 * 1000;

      const result = calculateOfflineEarnings(config, now);
      // Should cap at tier 5 -> x6
      expect(result.multiplierBreakdown.voidMeditationBonus).toBe(5);
    });
  });
});
