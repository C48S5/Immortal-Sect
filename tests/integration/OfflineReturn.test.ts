import { describe, it, expect } from 'vitest';
import Decimal from 'break_infinity.js';
import { D } from '@core/BigNumber';
import { calculateOfflineEarnings, type OfflineConfig } from '@core/OfflineCalc';

/**
 * OfflineReturn integration test.
 *
 * Simulates realistic offline return scenarios.
 */

describe('OfflineReturn Integration', () => {
  it('should calculate 8h offline with 1000 SS/s at base efficiency', () => {
    const config: OfflineConfig = {
      incomePerSecond: D(1000),
      lastSaveTime: 0,
      voidMeditationTier: 0,
      tribulation9Complete: false,
      bodyDaoActive: false,
    };
    const now = 8 * 3600 * 1000; // 8 hours in ms

    const result = calculateOfflineEarnings(config, now);
    // 1000 * 28800 * 0.5 = 14,400,000
    expect(result.spiritStones.toNumber()).toBeCloseTo(14400000, 0);
    expect(result.secondsAway).toBe(28800);
  });

  it('should calculate overnight 10h offline with various bonuses', () => {
    const config: OfflineConfig = {
      incomePerSecond: D(5000),
      lastSaveTime: 0,
      voidMeditationTier: 3,
      tribulation9Complete: false,
      bodyDaoActive: true,
    };
    const now = 10 * 3600 * 1000;

    const result = calculateOfflineEarnings(config, now);
    // Base = 0.5 + 0.25 = 0.75, void tier 3 = x4, trib = x1
    // Efficiency = 0.75 * 4 = 3.0
    // 5000 * 36000 * 3.0 = 540,000,000
    expect(result.spiritStones.toNumber()).toBeCloseTo(540000000, 0);
  });

  it('should handle endgame player returning after 72h cap', () => {
    const config: OfflineConfig = {
      incomePerSecond: D(1e9), // 1B SS/s endgame
      lastSaveTime: 0,
      voidMeditationTier: 5,
      tribulation9Complete: true,
      bodyDaoActive: true,
    };
    const now = 100 * 3600 * 1000; // 100 hours -> capped at 72

    const result = calculateOfflineEarnings(config, now);
    // Cap at 72h = 259200s
    expect(result.secondsAway).toBe(259200);
    // Efficiency = (0.5 + 0.25) * 6 * 3 = 0.75 * 18 = 13.5
    expect(result.efficiency).toBeCloseTo(13.5, 3);
    // 1e9 * 259200 * 13.5 = 3.4992e15
    expect(result.spiritStones.toNumber()).toBeCloseTo(3.4992e15, -12);
  });

  it('should calculate correctly for a short 30-minute break', () => {
    const config: OfflineConfig = {
      incomePerSecond: D(100),
      lastSaveTime: 0,
      voidMeditationTier: 0,
      tribulation9Complete: false,
      bodyDaoActive: false,
    };
    const now = 30 * 60 * 1000; // 30 minutes

    const result = calculateOfflineEarnings(config, now);
    // 100 * 1800 * 0.5 = 90,000
    expect(result.spiritStones.toNumber()).toBeCloseTo(90000, 0);
    expect(result.secondsAway).toBe(1800);
  });

  it('should return 0 for immediate return (no time elapsed)', () => {
    const config: OfflineConfig = {
      incomePerSecond: D(1000),
      lastSaveTime: Date.now(),
      voidMeditationTier: 5,
      tribulation9Complete: true,
      bodyDaoActive: true,
    };

    const result = calculateOfflineEarnings(config, config.lastSaveTime);
    expect(result.spiritStones.toNumber()).toBe(0);
  });
});
