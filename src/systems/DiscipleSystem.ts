/**
 * DiscipleSystem — Gacha summoning and hall assignment.
 *
 * Gacha rates: Common 52%, Uncommon 25%, Rare 15%, Epic 6%, Legendary 2%
 * Pity: guaranteed Epic+ every 50 pulls
 * Spark: choose any Legendary at 300 pulls
 *
 * DiscipleBonus = RarityMult x ElementMatch x TraitMatch
 *   Rarity: Common x1.05, Uncommon x1.12, Rare x1.25, Epic x1.50, Legendary x2.00
 *   Element match: x2.00
 *   Trait match: x1.25
 *   Max possible: x5.00 (Legendary + element + trait)
 *
 * 1 disciple per hall max. Cannot be in hall AND dungeon simultaneously.
 */
import Decimal from 'break_infinity.js';
import { D } from '@core/BigNumber';
import { Rarity } from '@models/disciple';
import type { Disciple, DiscipleConfig, HallConfig, HallState } from './types';

/** Rarity multipliers for hall bonuses */
const RARITY_MULTIPLIERS: Record<string, number> = {
  [Rarity.Common]: 1.05,
  [Rarity.Uncommon]: 1.12,
  [Rarity.Rare]: 1.25,
  [Rarity.Epic]: 1.50,
  [Rarity.Legendary]: 2.00,
};

/** Pull rate thresholds (cumulative) */
const PULL_RATES: { rarity: Rarity; cumulative: number }[] = [
  { rarity: Rarity.Common, cumulative: 0.52 },
  { rarity: Rarity.Uncommon, cumulative: 0.77 },
  { rarity: Rarity.Rare, cumulative: 0.92 },
  { rarity: Rarity.Epic, cumulative: 0.98 },
  { rarity: Rarity.Legendary, cumulative: 1.00 },
];

/** Hard pity threshold for guaranteed Epic+ */
const HARD_PITY_PULLS = 50;

/** Spark threshold for choosing any Legendary */
const SPARK_PULLS = 300;

/** Element match bonus multiplier */
const ELEMENT_MATCH_MULT = 2.0;

/** Trait match bonus multiplier */
const TRAIT_MATCH_MULT = 1.25;

/**
 * Determine the rarity of a single pull based on RNG and pity counter.
 */
export function rollRarity(
  pullsSinceLastEpic: number,
  randomValue?: number,
): Rarity {
  const roll = randomValue ?? Math.random();

  // Hard pity: if at threshold, guarantee Epic+
  if (pullsSinceLastEpic >= HARD_PITY_PULLS - 1) {
    // 75% Epic, 25% Legendary on pity
    return roll < 0.75 ? Rarity.Epic : Rarity.Legendary;
  }

  // Normal pull
  for (const { rarity, cumulative } of PULL_RATES) {
    if (roll < cumulative) return rarity;
  }

  return Rarity.Common; // fallback
}

/**
 * Pick a random disciple config of the given rarity from the pool.
 */
export function pickDiscipleConfig(
  rarity: Rarity,
  configs: DiscipleConfig[],
  randomValue?: number,
): DiscipleConfig | null {
  const candidates = configs.filter(c => c.rarity === rarity);
  if (candidates.length === 0) return null;

  const roll = randomValue ?? Math.random();
  const idx = Math.floor(roll * candidates.length);
  return candidates[idx];
}

/**
 * Generate a unique instance ID for a new disciple.
 */
function generateInstanceId(): string {
  return `disc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/** Result for a single pull within a summon */
export interface SinglePullResult {
  disciple: Disciple | null;
  duplicateLegendaryFragments: number;
  rarity: Rarity;
  configId: string | null;
}

/**
 * Perform a gacha summon (1 or 10 pulls).
 * Returns the new disciples and updated pity/pull counters.
 * Duplicate Legendary pulls grant 50 Legacy Fragments instead of the disciple.
 */
export function summonDisciple(
  pullCount: 1 | 10,
  configs: DiscipleConfig[],
  totalPulls: number,
  pullsSinceLastEpic: number,
  ownedLegendaryIds: string[] = [],
): {
  disciples: Disciple[];
  pullResults: SinglePullResult[];
  newTotalPulls: number;
  newPullsSinceLastEpic: number;
  sparkReady: boolean;
  totalDuplicateLegendaryFragments: number;
} {
  const results: Disciple[] = [];
  const pullResults: SinglePullResult[] = [];
  let currentPity = pullsSinceLastEpic;
  let currentTotal = totalPulls;
  let totalDupFragments = 0;

  for (let i = 0; i < pullCount; i++) {
    const rarity = rollRarity(currentPity);
    const config = pickDiscipleConfig(rarity, configs);

    if (config) {
      // Check for duplicate Legendary
      if (rarity === Rarity.Legendary && ownedLegendaryIds.includes(config.id)) {
        // Duplicate Legendary: award 50 Legacy Fragments instead
        totalDupFragments += 50;
        pullResults.push({
          disciple: null,
          duplicateLegendaryFragments: 50,
          rarity,
          configId: config.id,
        });
      } else {
        const disciple: Disciple = {
          instanceId: generateInstanceId(),
          configId: config.id,
          absorbedAbilities: [],
          assignedHallId: null,
          deployedRealmId: null,
          alive: true,
          injured: false,
          injuryHealsAt: 0,
        };
        results.push(disciple);
        pullResults.push({
          disciple,
          duplicateLegendaryFragments: 0,
          rarity,
          configId: config.id,
        });
      }
    } else {
      pullResults.push({
        disciple: null,
        duplicateLegendaryFragments: 0,
        rarity,
        configId: null,
      });
    }

    currentTotal++;

    // Reset pity on Epic+
    if (rarity === Rarity.Epic || rarity === Rarity.Legendary) {
      currentPity = 0;
    } else {
      currentPity++;
    }
  }

  return {
    disciples: results,
    pullResults,
    newTotalPulls: currentTotal,
    newPullsSinceLastEpic: currentPity,
    sparkReady: currentTotal >= SPARK_PULLS,
    totalDuplicateLegendaryFragments: totalDupFragments,
  };
}

/**
 * Check if the player has reached the Spark threshold (300 pulls).
 */
export function canSpark(totalPulls: number): boolean {
  return totalPulls >= SPARK_PULLS;
}

/**
 * Spark: choose any Legendary disciple from the pool.
 * Returns the chosen disciple. The store should reset the spark counter.
 */
export function sparkChoose(
  configId: string,
  configs: DiscipleConfig[],
): Disciple | null {
  const config = configs.find(c => c.id === configId && c.rarity === Rarity.Legendary);
  if (!config) return null;

  return {
    instanceId: generateInstanceId(),
    configId: config.id,
    absorbedAbilities: [],
    assignedHallId: null,
    deployedRealmId: null,
    alive: true,
    injured: false,
    injuryHealsAt: 0,
  };
}

/**
 * Assign a disciple to a hall.
 * Validates: disciple is alive, not in dungeon, hall doesn't already have a disciple,
 * disciple isn't already assigned elsewhere.
 */
export function assignToHall(
  discipleId: string,
  hallId: number,
  disciples: Disciple[],
  halls: HallState[],
): { success: boolean; updatedDisciple: Disciple | null; message: string } {
  const disciple = disciples.find(d => d.instanceId === discipleId);
  if (!disciple) {
    return { success: false, updatedDisciple: null, message: 'Disciple not found.' };
  }
  if (!disciple.alive) {
    return { success: false, updatedDisciple: null, message: 'Disciple is dead.' };
  }
  if (disciple.deployedRealmId !== null) {
    return { success: false, updatedDisciple: null, message: 'Disciple is deployed in a dungeon realm.' };
  }

  // Check if hall already has a disciple
  const hall = halls.find(h => h.hallId === hallId);
  if (!hall) {
    return { success: false, updatedDisciple: null, message: 'Hall not found.' };
  }
  if (hall.assignedDiscipleId !== null && hall.assignedDiscipleId !== discipleId) {
    return { success: false, updatedDisciple: null, message: 'Hall already has an assigned disciple.' };
  }

  const updated: Disciple = {
    ...disciple,
    assignedHallId: hallId,
  };

  return { success: true, updatedDisciple: updated, message: `Disciple assigned to Hall ${hallId}.` };
}

/**
 * Unassign a disciple from their current hall.
 */
export function unassignFromHall(
  discipleId: string,
  disciples: Disciple[],
): Disciple | null {
  const disciple = disciples.find(d => d.instanceId === discipleId);
  if (!disciple) return null;

  return {
    ...disciple,
    assignedHallId: null,
  };
}

/**
 * Calculate the DiscipleBonus multiplier for a disciple assigned to a hall.
 * DiscipleBonus = RarityMult x ElementMatch x TraitMatch
 */
export function calculateDiscipleBonus(
  _disciple: Disciple,
  config: DiscipleConfig,
  hallConfig: HallConfig,
): Decimal {
  // Rarity multiplier
  const rarityMult = RARITY_MULTIPLIERS[config.rarity] ?? 1;

  // Element match: x2 if disciple root matches hall element
  const elementMatch =
    hallConfig.element !== 'neutral' && config.root === hallConfig.element
      ? ELEMENT_MATCH_MULT
      : 1;

  // Trait match: x1.25 if disciple has a matching trait for this hall
  // TODO: Implement proper trait matching when trait configs are finalized
  // For now, check if hallPassive description mentions the hall's matching root
  const traitMatch =
    config.hallPassive.description.toLowerCase().includes(hallConfig.matchingRoot.toLowerCase())
      ? TRAIT_MATCH_MULT
      : 1;

  return D(rarityMult * elementMatch * traitMatch);
}

/**
 * Get the maximum possible DiscipleBonus (for UI display).
 */
export function getMaxDiscipleBonus(): Decimal {
  return D(RARITY_MULTIPLIERS[Rarity.Legendary] * ELEMENT_MATCH_MULT * TRAIT_MATCH_MULT);
}

/**
 * Get pulls until next pity.
 */
export function pullsUntilPity(pullsSinceLastEpic: number): number {
  return Math.max(0, HARD_PITY_PULLS - pullsSinceLastEpic);
}

/**
 * Get pulls until spark.
 */
export function pullsUntilSpark(totalPulls: number): number {
  return Math.max(0, SPARK_PULLS - totalPulls);
}
