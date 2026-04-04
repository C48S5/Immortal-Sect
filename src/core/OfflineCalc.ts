import Decimal from 'break_infinity.js';
import { D } from './BigNumber';

const MAX_OFFLINE_SECONDS = 72 * 60 * 60; // 72 hours
const BASE_OFFLINE_EFFICIENCY = 0.50;

/** Breakdown of multipliers applied to offline earnings */
export interface MultiplierBreakdown {
  base: number;
  voidMeditationBonus: number;
  tribulationBonus: number;
  bodyDaoBonus: number;
  totalEfficiency: number;
}

/** Result of offline earnings calculation */
export interface OfflineReturn {
  spiritStones: Decimal;
  secondsAway: number;
  efficiency: number;
  multiplierBreakdown: MultiplierBreakdown;
}

/**
 * Offline progression config from player state.
 * TODO: Replace with actual state shape once models/stores are integrated.
 */
export interface OfflineConfig {
  /** Spirit Stones per second at time of departure */
  incomePerSecond: Decimal;
  /** Timestamp (ms) when the player last saved/left */
  lastSaveTime: number;
  /** Void Meditation Sanctum milestone tier (0-5, each tier adds 1x) */
  voidMeditationTier: number;
  /** Whether Tribulation Challenge 9 has been completed */
  tribulation9Complete: boolean;
  /** Whether Body Dao path is active */
  bodyDaoActive: boolean;
}

/**
 * Calculate offline earnings based on time elapsed and player bonuses.
 *
 * Formula: incomePerSecond * secondsElapsed * totalEfficiency
 *
 * Efficiency modifiers:
 * - Base: 50%
 * - Void Meditation Sanctum: up to +5x (tier 1-5 each add 1x)
 *   Total with all tiers: base 0.5 * 6x = 3.0 (300%)
 * - Tribulation Challenge 9: x3
 * - Body Dao passive: +25% (additive to base before multipliers)
 */
export function calculateOfflineEarnings(
  config: OfflineConfig,
  now: number,
): OfflineReturn {
  const elapsedMs = now - config.lastSaveTime;
  const rawSeconds = Math.max(0, elapsedMs / 1000);
  const secondsAway = Math.min(rawSeconds, MAX_OFFLINE_SECONDS);

  if (secondsAway <= 0 || config.incomePerSecond.lte(0)) {
    return {
      spiritStones: D(0),
      secondsAway: 0,
      efficiency: 0,
      multiplierBreakdown: {
        base: BASE_OFFLINE_EFFICIENCY,
        voidMeditationBonus: 0,
        tribulationBonus: 1,
        bodyDaoBonus: 0,
        totalEfficiency: 0,
      },
    };
  }

  // Base efficiency
  let baseEff = BASE_OFFLINE_EFFICIENCY;

  // Body Dao passive: +25% additive to base
  const bodyDaoBonus = config.bodyDaoActive ? 0.25 : 0;
  baseEff += bodyDaoBonus;

  // Void Meditation Sanctum: each tier adds 1x multiplier (up to 6x total at tier 5)
  // tier 0 = 1x, tier 1 = 2x, ... tier 5 = 6x
  const voidTier = Math.max(0, Math.min(config.voidMeditationTier, 5));
  const voidMultiplier = 1 + voidTier;

  // Tribulation Challenge 9: x3
  const tribMultiplier = config.tribulation9Complete ? 3 : 1;

  const totalEfficiency = baseEff * voidMultiplier * tribMultiplier;

  const spiritStones = config.incomePerSecond
    .mul(secondsAway)
    .mul(totalEfficiency);

  return {
    spiritStones,
    secondsAway,
    efficiency: totalEfficiency,
    multiplierBreakdown: {
      base: BASE_OFFLINE_EFFICIENCY,
      voidMeditationBonus: voidTier,
      tribulationBonus: tribMultiplier,
      bodyDaoBonus,
      totalEfficiency,
    },
  };
}
