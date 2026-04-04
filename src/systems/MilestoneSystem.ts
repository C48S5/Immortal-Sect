/**
 * MilestoneSystem — Tracks and computes milestone bonuses for cultivation halls.
 *
 * Milestone types:
 *   - speed(self): increases cycle speed for owning hall
 *   - profit(self): increases profit for owning hall
 *   - allProfit: increases profit for ALL halls
 *   - allSpeed: increases speed for ALL halls
 *   - aeGeneration: bonus AE per second
 *   - costReduction: reduces upgrade costs
 *   - SPECIAL: unique effects (Body Tempering cross-hall, Talisman buff extension, etc.)
 */
import Decimal from 'break_infinity.js';
import { D } from '@core/BigNumber';
import type { Milestone } from '@models/hall';
import { HALL_1_MILESTONES, HALL_2_MILESTONES, HALL_3_MILESTONES, HALL_4_MILESTONES, HALL_5_MILESTONES, HALL_6_MILESTONES } from '@data/milestoneConfigs';
import { HALL_7_MILESTONES, HALL_8_MILESTONES, HALL_9_MILESTONES, HALL_10_MILESTONES, HALL_11_MILESTONES, HALL_12_MILESTONES } from '@data/milestoneConfigs2';
import { SECT_HARMONY_MILESTONES } from '@data/sectHarmonyConfigs';

/** Canonical milestone definitions per hall, imported from data configs. */
const HALL_MILESTONES: Record<number, readonly Milestone[]> = {
  1: HALL_1_MILESTONES, 2: HALL_2_MILESTONES, 3: HALL_3_MILESTONES,
  4: HALL_4_MILESTONES, 5: HALL_5_MILESTONES, 6: HALL_6_MILESTONES,
  7: HALL_7_MILESTONES, 8: HALL_8_MILESTONES, 9: HALL_9_MILESTONES,
  10: HALL_10_MILESTONES, 11: HALL_11_MILESTONES, 12: HALL_12_MILESTONES,
};

/** Get all milestone definitions for a hall. */
export function getMilestoneConfig(hallId: number): readonly Milestone[] {
  return HALL_MILESTONES[hallId] ?? [];
}

/**
 * Returns newly reached milestones when a hall levels up.
 * Compares previous level to current level and returns any milestones in between.
 */
export function checkMilestones(hallId: number, previousLevel: number, currentLevel: number): Milestone[] {
  const milestones = getMilestoneConfig(hallId);
  return milestones.filter(m => m.level > previousLevel && m.level <= currentLevel);
}

/**
 * Returns the accumulated speed and profit multipliers from all active milestones
 * for a given hall at a given level.
 */
export function getActiveMilestones(
  hallId: number,
  level: number,
): { speedMult: Decimal; profitMult: Decimal } {
  const milestones = getMilestoneConfig(hallId);

  let speedMult = D(1);
  let profitMult = D(1);

  for (const m of milestones) {
    if (m.level > level) continue;
    if (m.appliesToAll) continue; // Global effects handled separately

    switch (m.effectType) {
      case 'speed':
        speedMult = speedMult.mul(m.multiplier);
        break;
      case 'profit':
        profitMult = profitMult.mul(m.multiplier);
        break;
      // aeGeneration, costReduction handled by their respective systems
    }
  }

  return { speedMult, profitMult };
}

/**
 * Sect Harmony Bonus: combines two sources of global multipliers:
 * 1. Per-hall milestones that have appliesToAll=true (e.g. Hall 2 cross-hall profit).
 * 2. SECT_HARMONY_MILESTONES — triggered when ALL 12 halls reach a minimum level.
 */
export function getSectHarmonyBonus(
  hallLevels: number[],
): { speedMult: Decimal; profitMult: Decimal } {
  let speedMult = D(1);
  let profitMult = D(1);

  // 1. Per-hall appliesToAll milestones
  for (let hallId = 1; hallId <= 12; hallId++) {
    const level = hallLevels[hallId - 1] ?? 0;
    const milestones = getMilestoneConfig(hallId);

    for (const m of milestones) {
      if (m.level > level) continue;
      if (!m.appliesToAll) continue;

      switch (m.effectType) {
        case 'allProfit':
          profitMult = profitMult.mul(m.multiplier);
          break;
        case 'allSpeed':
          speedMult = speedMult.mul(m.multiplier);
          break;
      }
    }
  }

  // 2. Sect Harmony milestones — minimum level across ALL halls must meet threshold
  const minLevel = hallLevels.length >= 12
    ? Math.min(...hallLevels)
    : 0;

  for (const m of SECT_HARMONY_MILESTONES) {
    if (m.level > minLevel) continue;

    switch (m.effectType) {
      case 'allProfit':
        profitMult = profitMult.mul(m.multiplier);
        break;
      case 'allSpeed':
        speedMult = speedMult.mul(m.multiplier);
        break;
    }
  }

  return { speedMult, profitMult };
}

/**
 * Body Tempering Forge (Hall 2) cross-hall profit bonus.
 * This is the accumulated allProfit multiplier specifically from Hall 2 milestones
 * that have the bodyTemperingAll special effect.
 */
export function getBodyTemperingAllBonus(bodyTemperingLevel: number): Decimal {
  const milestones = getMilestoneConfig(2);
  let mult = D(1);

  for (const m of milestones) {
    if (m.level > bodyTemperingLevel) continue;
    if (m.specialEffect === 'bodyTemperingAll') {
      mult = mult.mul(m.multiplier);
    }
  }

  return mult;
}

/**
 * Get total AE bonus per second from all hall milestones.
 */
export function getAEBonusFromMilestones(hallLevels: number[]): number {
  let totalBonus = 0;

  for (let hallId = 1; hallId <= 12; hallId++) {
    const level = hallLevels[hallId - 1] ?? 0;
    const milestones = getMilestoneConfig(hallId);

    for (const m of milestones) {
      if (m.level > level) continue;
      if (m.aeBonusPerSecond) {
        totalBonus += m.aeBonusPerSecond;
      }
    }
  }

  return totalBonus;
}

/**
 * Get the buff duration extension percentage from Talisman Studio (Hall 6) milestones.
 * Returns the total extra seconds to add to buff durations.
 */
export function getBuffDurationExtension(talismanStudioLevel: number): number {
  const milestones = getMilestoneConfig(6);
  let totalExtension = 0;

  for (const m of milestones) {
    if (m.level > talismanStudioLevel) continue;
    if (m.specialEffect === 'alchemyDuration') {
      // Each alchemy duration milestone adds 10 seconds to buff durations
      totalExtension += 10;
    }
  }

  return totalExtension;
}

/**
 * Get Mandate effectiveness multiplier from Dao Throne (Hall 12) milestones.
 */
export function getMandateEffectivenessBonus(daoThroneLevel: number): number {
  const milestones = getMilestoneConfig(12);
  let best = 1;

  for (const m of milestones) {
    if (m.level > daoThroneLevel) continue;
    if (m.specialEffect === 'mandateEffectiveness') {
      // Each mandate effectiveness milestone adds +10% effectiveness
      best += 0.10;
    }
  }

  return best;
}
