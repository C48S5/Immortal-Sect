import type { Milestone } from '../models/hall';

/**
 * Hall 1: Qi Gathering Pavilion -- 26 milestones
 * Pure self-buffs: speed and profit only.
 */
export const HALL_1_MILESTONES: readonly Milestone[] = [
  { level: 25, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 50, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 100, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 150, effectType: 'profit', multiplier: 2, appliesToAll: false },
  { level: 200, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 250, effectType: 'profit', multiplier: 2, appliesToAll: false },
  { level: 300, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 350, effectType: 'profit', multiplier: 3, appliesToAll: false },
  { level: 400, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 500, effectType: 'profit', multiplier: 4, appliesToAll: false },
  { level: 600, effectType: 'profit', multiplier: 4, appliesToAll: false },
  { level: 700, effectType: 'profit', multiplier: 4, appliesToAll: false },
  { level: 800, effectType: 'profit', multiplier: 5, appliesToAll: false },
  { level: 900, effectType: 'profit', multiplier: 5, appliesToAll: false },
  { level: 1000, effectType: 'profit', multiplier: 10, appliesToAll: false },
  { level: 1250, effectType: 'profit', multiplier: 10, appliesToAll: false },
  { level: 1500, effectType: 'profit', multiplier: 20, appliesToAll: false },
  { level: 2000, effectType: 'profit', multiplier: 50, appliesToAll: false },
  { level: 2500, effectType: 'profit', multiplier: 100, appliesToAll: false },
  { level: 3000, effectType: 'profit', multiplier: 200, appliesToAll: false },
  { level: 4000, effectType: 'profit', multiplier: 500, appliesToAll: false },
  { level: 5000, effectType: 'profit', multiplier: 1000, appliesToAll: false },
  { level: 6000, effectType: 'profit', multiplier: 2000, appliesToAll: false },
  { level: 7000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
  { level: 8000, effectType: 'profit', multiplier: 10000, appliesToAll: false },
  { level: 10000, effectType: 'profit', multiplier: 50000, appliesToAll: false },
];

/**
 * Hall 2: Body Tempering Dojo -- 18 milestones (CROSS-HALL)
 * Mix of self-buffs and ALL halls profit boosts.
 */
export const HALL_2_MILESTONES: readonly Milestone[] = [
  { level: 25, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 50, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 100, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 200, effectType: 'profit', multiplier: 2, appliesToAll: false },
  { level: 300, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 400, effectType: 'allProfit', multiplier: 2, appliesToAll: true },
  { level: 500, effectType: 'profit', multiplier: 3, appliesToAll: false },
  { level: 600, effectType: 'allProfit', multiplier: 2, appliesToAll: true },
  { level: 800, effectType: 'allProfit', multiplier: 2, appliesToAll: true },
  { level: 1000, effectType: 'allProfit', multiplier: 3, appliesToAll: true },
  { level: 1200, effectType: 'profit', multiplier: 4, appliesToAll: false },
  { level: 1500, effectType: 'allProfit', multiplier: 5, appliesToAll: true },
  { level: 2000, effectType: 'allProfit', multiplier: 10, appliesToAll: true },
  { level: 2500, effectType: 'allProfit', multiplier: 25, appliesToAll: true },
  { level: 3000, effectType: 'allProfit', multiplier: 50, appliesToAll: true },
  { level: 4000, effectType: 'allProfit', multiplier: 100, appliesToAll: true },
  { level: 5000, effectType: 'allProfit', multiplier: 500, appliesToAll: true },
  { level: 5400, effectType: 'allProfit', multiplier: 1000, appliesToAll: true },
];

/**
 * Hall 3: Alchemy Furnace Chamber -- 22 milestones
 * SPECIAL: AE generation. Base rate = 0.01 x level per cycle (6s).
 */
export const HALL_3_MILESTONES: readonly Milestone[] = [
  { level: 25, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 50, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 75, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 100, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 150, effectType: 'profit', multiplier: 2, appliesToAll: false },
  {
    level: 200, effectType: 'profit', multiplier: 2, appliesToAll: false,
    specialEffect: 'aeGeneration', aeBonusPerSecond: 1,
  },
  { level: 300, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 400, effectType: 'profit', multiplier: 3, appliesToAll: false },
  {
    level: 500, effectType: 'speed', multiplier: 2, appliesToAll: false,
    specialEffect: 'aeGeneration', aeBonusPerSecond: 4,
  },
  { level: 600, effectType: 'profit', multiplier: 4, appliesToAll: false },
  { level: 800, effectType: 'profit', multiplier: 5, appliesToAll: false },
  {
    level: 1000, effectType: 'profit', multiplier: 10, appliesToAll: false,
    specialEffect: 'aeGeneration', aeBonusPerSecond: 20,
  },
  { level: 1250, effectType: 'profit', multiplier: 10, appliesToAll: false },
  { level: 1500, effectType: 'profit', multiplier: 20, appliesToAll: false },
  {
    level: 2000, effectType: 'profit', multiplier: 50, appliesToAll: false,
    specialEffect: 'aeGeneration', aeBonusPerSecond: 75,
  },
  { level: 2500, effectType: 'profit', multiplier: 100, appliesToAll: false },
  { level: 3000, effectType: 'profit', multiplier: 200, appliesToAll: false },
  {
    level: 4000, effectType: 'profit', multiplier: 500, appliesToAll: false,
    specialEffect: 'aeGeneration', aeBonusPerSecond: 400,
  },
  { level: 5000, effectType: 'profit', multiplier: 1000, appliesToAll: false },
  { level: 6000, effectType: 'profit', multiplier: 2000, appliesToAll: false },
  { level: 7000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
  { level: 8000, effectType: 'profit', multiplier: 10000, appliesToAll: false },
];

/**
 * Hall 4: Formation Array Hall -- 20 milestones
 * SPECIAL: -5% cost reduction ALL other halls per SPECIAL milestone
 * (multiplicative, 6 total = 26.5% reduction)
 */
export const HALL_4_MILESTONES: readonly Milestone[] = [
  { level: 30, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 60, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 100, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 175, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 250, effectType: 'profit', multiplier: 2, appliesToAll: false },
  {
    level: 300, effectType: 'profit', multiplier: 2, appliesToAll: false,
    specialEffect: 'costReduction',
  },
  { level: 400, effectType: 'speed', multiplier: 2, appliesToAll: false },
  {
    level: 500, effectType: 'profit', multiplier: 3, appliesToAll: false,
    specialEffect: 'costReduction',
  },
  { level: 600, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 700, effectType: 'profit', multiplier: 4, appliesToAll: false },
  {
    level: 800, effectType: 'profit', multiplier: 4, appliesToAll: false,
    specialEffect: 'costReduction',
  },
  { level: 1000, effectType: 'profit', multiplier: 5, appliesToAll: false },
  {
    level: 1250, effectType: 'profit', multiplier: 10, appliesToAll: false,
    specialEffect: 'costReduction',
  },
  { level: 1500, effectType: 'profit', multiplier: 20, appliesToAll: false },
  {
    level: 2000, effectType: 'profit', multiplier: 50, appliesToAll: false,
    specialEffect: 'costReduction',
  },
  { level: 2500, effectType: 'profit', multiplier: 100, appliesToAll: false },
  {
    level: 3000, effectType: 'profit', multiplier: 200, appliesToAll: false,
    specialEffect: 'costReduction',
  },
  { level: 4000, effectType: 'profit', multiplier: 500, appliesToAll: false },
  { level: 5000, effectType: 'profit', multiplier: 1000, appliesToAll: false },
  { level: 6000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
];

/**
 * Hall 5: Spirit Beast Garden -- 22 milestones
 * SPECIAL: AE generation bonus (secondary to Hall 3)
 */
export const HALL_5_MILESTONES: readonly Milestone[] = [
  { level: 25, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 50, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 100, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 150, effectType: 'profit', multiplier: 2, appliesToAll: false },
  {
    level: 200, effectType: 'speed', multiplier: 2, appliesToAll: false,
    specialEffect: 'aeGeneration', aeBonusPerSecond: 0.5,
  },
  { level: 300, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 400, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 500, effectType: 'profit', multiplier: 2, appliesToAll: false },
  {
    level: 600, effectType: 'profit', multiplier: 3, appliesToAll: false,
    specialEffect: 'aeGeneration', aeBonusPerSecond: 2,
  },
  { level: 800, effectType: 'profit', multiplier: 4, appliesToAll: false },
  {
    level: 1000, effectType: 'profit', multiplier: 5, appliesToAll: false,
    specialEffect: 'aeGeneration', aeBonusPerSecond: 10,
  },
  { level: 1250, effectType: 'profit', multiplier: 10, appliesToAll: false },
  { level: 1500, effectType: 'profit', multiplier: 10, appliesToAll: false },
  {
    level: 2000, effectType: 'profit', multiplier: 20, appliesToAll: false,
    specialEffect: 'aeGeneration', aeBonusPerSecond: 40,
  },
  { level: 2500, effectType: 'profit', multiplier: 50, appliesToAll: false },
  { level: 3000, effectType: 'profit', multiplier: 100, appliesToAll: false },
  {
    level: 4000, effectType: 'profit', multiplier: 200, appliesToAll: false,
    specialEffect: 'aeGeneration', aeBonusPerSecond: 200,
  },
  { level: 5000, effectType: 'profit', multiplier: 500, appliesToAll: false },
  { level: 6000, effectType: 'profit', multiplier: 1000, appliesToAll: false },
  { level: 7000, effectType: 'profit', multiplier: 2000, appliesToAll: false },
  { level: 8000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
  { level: 10000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
];

/**
 * Hall 6: Talisman Inscription Studio -- 22 milestones
 * SPECIAL: +duration to alchemy buffs per SPECIAL milestone
 */
export const HALL_6_MILESTONES: readonly Milestone[] = [
  { level: 25, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 50, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 100, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 150, effectType: 'profit', multiplier: 2, appliesToAll: false },
  {
    level: 200, effectType: 'speed', multiplier: 2, appliesToAll: false,
    specialEffect: 'alchemyDuration',
  },
  { level: 300, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 400, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 500, effectType: 'profit', multiplier: 2, appliesToAll: false },
  {
    level: 600, effectType: 'profit', multiplier: 3, appliesToAll: false,
    specialEffect: 'alchemyDuration',
  },
  { level: 800, effectType: 'profit', multiplier: 4, appliesToAll: false },
  {
    level: 1000, effectType: 'profit', multiplier: 5, appliesToAll: false,
    specialEffect: 'alchemyDuration',
  },
  { level: 1250, effectType: 'profit', multiplier: 10, appliesToAll: false },
  { level: 1500, effectType: 'profit', multiplier: 10, appliesToAll: false },
  {
    level: 2000, effectType: 'profit', multiplier: 20, appliesToAll: false,
    specialEffect: 'alchemyDuration',
  },
  { level: 2500, effectType: 'profit', multiplier: 50, appliesToAll: false },
  { level: 3000, effectType: 'profit', multiplier: 100, appliesToAll: false },
  {
    level: 4000, effectType: 'profit', multiplier: 200, appliesToAll: false,
    specialEffect: 'alchemyDuration',
  },
  { level: 5000, effectType: 'profit', multiplier: 500, appliesToAll: false },
  { level: 6000, effectType: 'profit', multiplier: 1000, appliesToAll: false },
  { level: 7000, effectType: 'profit', multiplier: 2000, appliesToAll: false },
  { level: 8000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
  { level: 10000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
];

/** Map of hall ID to its milestones (halls 1-6) */
export const MILESTONE_CONFIGS_1_6: Record<number, readonly Milestone[]> = {
  1: HALL_1_MILESTONES,
  2: HALL_2_MILESTONES,
  3: HALL_3_MILESTONES,
  4: HALL_4_MILESTONES,
  5: HALL_5_MILESTONES,
  6: HALL_6_MILESTONES,
};
