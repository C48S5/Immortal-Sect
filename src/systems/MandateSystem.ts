/**
 * MandateSystem — Heavenly Mandate upgrades for each hall.
 *
 * 12 slots (1 per hall), 4 levels each.
 * Level multipliers: L1=x1.5, L2=x3, L3=x6, L4=x15
 * Seal costs: L1=1HS, L2=3HS, L3=10HS, L4=25HS
 *
 * Hall 12 (Dao Throne) SPECIAL milestones increase Mandate effectiveness.
 */
import type { MandateSlot } from './types';

/** Level multiplier table (index 0 = no mandate) */
const LEVEL_MULTIPLIERS = [1, 1.5, 3, 6, 15] as const;

/** Heavenly Seal cost per level */
const SEAL_COSTS = [0, 1, 3, 10, 25] as const;

/** Maximum mandate level */
const MAX_LEVEL = 4;

/**
 * Get the multiplier for a hall based on its mandate level.
 * Optionally apply Dao Throne effectiveness bonus.
 */
export function getMandateMultiplier(
  hallId: number,
  mandates: MandateSlot[],
  daoThroneEffectivenessBonus: number = 1,
): number {
  const slot = mandates.find(m => m.hallId === hallId);
  if (!slot || slot.level <= 0) return 1;

  const level = Math.min(slot.level, MAX_LEVEL);
  const baseMult = LEVEL_MULTIPLIERS[level];

  // Dao Throne bonus scales the mandate multiplier above 1
  // e.g. if baseMult=3 and bonus=1.25, result = 1 + (3-1)*1.25 = 3.5
  if (daoThroneEffectivenessBonus > 1) {
    return 1 + (baseMult - 1) * daoThroneEffectivenessBonus;
  }

  return baseMult;
}

/**
 * Get the seal cost to upgrade a mandate slot to the next level.
 * Returns null if already at max level.
 */
export function getUpgradeCost(hallId: number, mandates: MandateSlot[]): number | null {
  const slot = mandates.find(m => m.hallId === hallId);
  const currentLevel = slot?.level ?? 0;

  if (currentLevel >= MAX_LEVEL) return null;

  return SEAL_COSTS[currentLevel + 1];
}

/**
 * Attempt to upgrade a mandate slot.
 * Returns the updated mandates array and whether the upgrade succeeded.
 */
export function upgradeMandateSlot(
  hallId: number,
  mandates: MandateSlot[],
  heavenlySeals: number,
): { mandates: MandateSlot[]; success: boolean; sealCost: number; message: string } {
  const cost = getUpgradeCost(hallId, mandates);

  if (cost === null) {
    return {
      mandates,
      success: false,
      sealCost: 0,
      message: `Hall ${hallId} mandate is already at maximum level.`,
    };
  }

  if (heavenlySeals < cost) {
    return {
      mandates,
      success: false,
      sealCost: cost,
      message: `Need ${cost} Heavenly Seals (have ${heavenlySeals}).`,
    };
  }

  const updated = mandates.map(m => {
    if (m.hallId === hallId) {
      return { ...m, level: m.level + 1 };
    }
    return m;
  });

  // If the slot doesn't exist yet, add it
  const exists = updated.some(m => m.hallId === hallId);
  if (!exists) {
    updated.push({ hallId, level: 1 });
  }

  const newLevel = (updated.find(m => m.hallId === hallId)?.level ?? 1);

  return {
    mandates: updated,
    success: true,
    sealCost: cost,
    message: `Hall ${hallId} mandate upgraded to Level ${newLevel} (x${LEVEL_MULTIPLIERS[newLevel]}).`,
  };
}

/**
 * Get a summary of all mandate slots and their multipliers.
 */
export function getMandateSummary(
  mandates: MandateSlot[],
  daoThroneEffectivenessBonus: number = 1,
): { hallId: number; level: number; multiplier: number; nextCost: number | null }[] {
  const summary: { hallId: number; level: number; multiplier: number; nextCost: number | null }[] = [];

  for (let hallId = 1; hallId <= 12; hallId++) {
    const slot = mandates.find(m => m.hallId === hallId);
    const level = slot?.level ?? 0;
    summary.push({
      hallId,
      level,
      multiplier: getMandateMultiplier(hallId, mandates, daoThroneEffectivenessBonus),
      nextCost: level < MAX_LEVEL ? SEAL_COSTS[level + 1] : null,
    });
  }

  return summary;
}

/**
 * Get the total Heavenly Seals needed to max all mandate slots.
 */
export function getTotalSealCostToMax(mandates: MandateSlot[]): number {
  let total = 0;

  for (let hallId = 1; hallId <= 12; hallId++) {
    const slot = mandates.find(m => m.hallId === hallId);
    const currentLevel = slot?.level ?? 0;

    for (let lvl = currentLevel + 1; lvl <= MAX_LEVEL; lvl++) {
      total += SEAL_COSTS[lvl];
    }
  }

  return total;
}

/**
 * Initialize default mandate slots for all 12 halls.
 */
export function createDefaultMandates(): MandateSlot[] {
  const mandates: MandateSlot[] = [];
  for (let hallId = 1; hallId <= 12; hallId++) {
    mandates.push({ hallId, level: 0 });
  }
  return mandates;
}
