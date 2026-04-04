import type { Milestone } from '../models/hall';

/**
 * Sect Harmony milestones: triggered when ALL 12 halls reach a minimum level.
 * These provide global multipliers to all halls.
 */
export const SECT_HARMONY_MILESTONES: readonly Milestone[] = [
  { level: 25, effectType: 'allSpeed', multiplier: 2, appliesToAll: true },
  { level: 50, effectType: 'allSpeed', multiplier: 2, appliesToAll: true },
  { level: 100, effectType: 'allSpeed', multiplier: 2, appliesToAll: true },
  { level: 150, effectType: 'allProfit', multiplier: 2, appliesToAll: true },
  { level: 200, effectType: 'allSpeed', multiplier: 2, appliesToAll: true },
  { level: 250, effectType: 'allProfit', multiplier: 3, appliesToAll: true },
  { level: 300, effectType: 'allSpeed', multiplier: 2, appliesToAll: true },
  { level: 400, effectType: 'allProfit', multiplier: 4, appliesToAll: true },
  { level: 500, effectType: 'allSpeed', multiplier: 2, appliesToAll: true },
  { level: 500, effectType: 'allProfit', multiplier: 5, appliesToAll: true },
  { level: 750, effectType: 'allProfit', multiplier: 10, appliesToAll: true },
  { level: 1000, effectType: 'allProfit', multiplier: 25, appliesToAll: true },
  { level: 1500, effectType: 'allProfit', multiplier: 50, appliesToAll: true },
  { level: 2000, effectType: 'allProfit', multiplier: 100, appliesToAll: true },
  { level: 3000, effectType: 'allProfit', multiplier: 500, appliesToAll: true },
  { level: 5000, effectType: 'allProfit', multiplier: 1000, appliesToAll: true },
];
