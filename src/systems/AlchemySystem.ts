/**
 * AlchemySystem — Crafting pills/elixirs and managing active buffs.
 *
 * AE generation:
 *   - Hall 3 base rate = 0.01 * level per cycle (6s)
 *   - Hall 5 secondary = ~40% of Hall 3 rate
 *   - Milestone AE bonuses stack additively
 *
 * Talisman Studio (Hall 6) SPECIAL milestones extend buff durations.
 * Alchemy Dao passive: -20% craft time (applied externally by store).
 */
import Decimal from 'break_infinity.js';
import { D } from '@core/BigNumber';
import type { AlchemyItemConfig, ActiveBuff, AlchemyState } from '@models/alchemy';
import { ALCHEMY_ITEM_CONFIGS } from '@data/alchemyConfigs';

/** Get an alchemy item config by ID. */
export function getAlchemyItemConfig(itemId: number): AlchemyItemConfig | undefined {
  return ALCHEMY_ITEM_CONFIGS.find(i => i.id === itemId);
}

/** Get all alchemy item configs. */
export function getAllAlchemyItemConfigs(): readonly AlchemyItemConfig[] {
  return ALCHEMY_ITEM_CONFIGS;
}

/**
 * Calculate AE generation rate per second.
 *
 * Hall 3 contributes: 0.01 * hall3Level / cycleTime (6s default)
 * Hall 5 contributes: 0.004 * hall5Level / cycleTime (~40% of Hall 3)
 * Plus milestone AE bonuses.
 */
export function calculateAEPerSecond(
  hall3Level: number,
  hall5Level: number,
  milestoneAEBonus: number,
  spellAEMultiplier: number,
): number {
  const HALL3_CYCLE = 6; // seconds
  const HALL5_CYCLE = 24;

  const hall3Rate = (0.01 * hall3Level) / HALL3_CYCLE;
  const hall5Rate = (0.004 * hall5Level) / HALL5_CYCLE;
  const baseRate = hall3Rate + hall5Rate + milestoneAEBonus;

  return baseRate * spellAEMultiplier;
}

/**
 * Attempt to craft an alchemy item.
 * Returns the new buff if successful, or null if insufficient AE or locked.
 */
export function craftItem(
  itemId: number,
  currentAE: Decimal,
  hall3Level: number,
  buffDurationExtension: number,
  alchemyCostReduction: number = 0,
): { buff: ActiveBuff; aeCost: number } | null {
  const config = getAlchemyItemConfig(itemId);
  if (!config) return null;

  // Check unlock level
  if (hall3Level < config.unlockLevel) return null;

  // Apply Alchemy Dao passive: -20% AE cost when active (alchemyCostReduction = 0.20)
  const effectiveCost = config.aeCost * (1 - alchemyCostReduction);

  // Check AE cost
  if (currentAE.lt(effectiveCost)) return null;

  const buff: ActiveBuff = {
    itemId: config.id,
    remainingSeconds: config.durationSeconds + buffDurationExtension,
    multiplier: config.multiplier,
    affectedHallIds: config.affectedHallIds,
  };

  return { buff, aeCost: effectiveCost };
}

/**
 * Get all currently active buffs (convenience wrapper).
 */
export function getActiveBuffs(state: AlchemyState): ActiveBuff[] {
  return state.activeBuffs.filter(b => b.remainingSeconds > 0);
}

/**
 * Tick all active buffs, decrementing their durations.
 * Returns the updated buff array with expired buffs removed.
 */
export function tickBuffs(buffs: ActiveBuff[], deltaTime: number): ActiveBuff[] {
  const updated: ActiveBuff[] = [];

  for (const buff of buffs) {
    const remaining = buff.remainingSeconds - deltaTime;
    if (remaining > 0) {
      updated.push({ ...buff, remainingSeconds: remaining });
    }
    // Expired buffs are simply not included
  }

  return updated;
}

/**
 * Calculate the total alchemy multiplier for a specific hall.
 * Multiplies all active buffs that affect this hall.
 */
export function getAlchemyMultiplier(hallId: number, buffs: ActiveBuff[]): Decimal {
  let mult = D(1);

  for (const buff of buffs) {
    if (buff.remainingSeconds <= 0) continue;

    // Empty affectedHallIds means ALL halls
    if (buff.affectedHallIds.length === 0 || buff.affectedHallIds.includes(hallId)) {
      mult = mult.mul(buff.multiplier);
    }
  }

  return mult;
}

/**
 * Check if any buff will expire soon (within threshold seconds).
 * Useful for UI warnings.
 */
export function getExpiringBuffs(buffs: ActiveBuff[], thresholdSeconds: number): ActiveBuff[] {
  return buffs.filter(
    b => b.remainingSeconds > 0 && b.remainingSeconds <= thresholdSeconds,
  );
}
