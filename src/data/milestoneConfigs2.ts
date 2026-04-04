import type { Milestone } from '../models/hall';

/**
 * Hall 7: Sword Refinement Peak -- 24 milestones (HIGHEST PROFIT)
 * Pure income hall. No utility gimmicks. Has the largest raw profit
 * multipliers of any hall — the "powerhouse" for raw SS generation.
 */
export const HALL_7_MILESTONES: readonly Milestone[] = [
  { level: 35, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 70, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 110, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 175, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 250, effectType: 'profit', multiplier: 3, appliesToAll: false },
  { level: 400, effectType: 'profit', multiplier: 4, appliesToAll: false },
  { level: 600, effectType: 'profit', multiplier: 5, appliesToAll: false },
  { level: 800, effectType: 'profit', multiplier: 8, appliesToAll: false },
  { level: 1000, effectType: 'profit', multiplier: 10, appliesToAll: false },
  { level: 1250, effectType: 'profit', multiplier: 15, appliesToAll: false },
  { level: 1500, effectType: 'profit', multiplier: 20, appliesToAll: false },
  { level: 2000, effectType: 'profit', multiplier: 50, appliesToAll: false },
  { level: 2500, effectType: 'profit', multiplier: 100, appliesToAll: false },
  { level: 3000, effectType: 'profit', multiplier: 200, appliesToAll: false },
  { level: 3500, effectType: 'profit', multiplier: 500, appliesToAll: false },
  { level: 4000, effectType: 'profit', multiplier: 1000, appliesToAll: false },
  { level: 4500, effectType: 'profit', multiplier: 2000, appliesToAll: false },
  { level: 5000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
  { level: 6000, effectType: 'profit', multiplier: 10000, appliesToAll: false },
  { level: 7000, effectType: 'profit', multiplier: 25000, appliesToAll: false },
  { level: 8000, effectType: 'profit', multiplier: 50000, appliesToAll: false },
  { level: 9000, effectType: 'profit', multiplier: 100000, appliesToAll: false },
  { level: 10000, effectType: 'profit', multiplier: 250000, appliesToAll: false },
  { level: 12000, effectType: 'profit', multiplier: 500000, appliesToAll: false },
];

/**
 * Hall 8: Tribulation Lightning Tower -- 20 milestones
 * SPECIAL: Flat HDP bonus per Ascension. Stacks with the normal HDP formula.
 */
export const HALL_8_MILESTONES: readonly Milestone[] = [
  { level: 60, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 120, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 200, effectType: 'speed', multiplier: 2, appliesToAll: false },
  {
    level: 350, effectType: 'profit', multiplier: 2, appliesToAll: false,
    specialEffect: 'hdpBonus', hdpBonusFlat: 10,
  },
  { level: 550, effectType: 'profit', multiplier: 3, appliesToAll: false },
  {
    level: 800, effectType: 'profit', multiplier: 4, appliesToAll: false,
    specialEffect: 'hdpBonus', hdpBonusFlat: 50,
  },
  { level: 1000, effectType: 'profit', multiplier: 5, appliesToAll: false },
  {
    level: 1500, effectType: 'profit', multiplier: 10, appliesToAll: false,
    specialEffect: 'hdpBonus', hdpBonusFlat: 200,
  },
  { level: 2000, effectType: 'profit', multiplier: 20, appliesToAll: false },
  {
    level: 2500, effectType: 'profit', multiplier: 50, appliesToAll: false,
    specialEffect: 'hdpBonus', hdpBonusFlat: 500,
  },
  { level: 3000, effectType: 'profit', multiplier: 100, appliesToAll: false },
  {
    level: 3500, effectType: 'profit', multiplier: 200, appliesToAll: false,
    specialEffect: 'hdpBonus', hdpBonusFlat: 1000,
  },
  { level: 4000, effectType: 'profit', multiplier: 500, appliesToAll: false },
  {
    level: 5000, effectType: 'profit', multiplier: 1000, appliesToAll: false,
    specialEffect: 'hdpBonus', hdpBonusFlat: 2000,
  },
  { level: 6000, effectType: 'profit', multiplier: 2000, appliesToAll: false },
  {
    level: 7000, effectType: 'profit', multiplier: 5000, appliesToAll: false,
    specialEffect: 'hdpBonus', hdpBonusFlat: 3500,
  },
  { level: 8000, effectType: 'profit', multiplier: 10000, appliesToAll: false },
  {
    level: 9000, effectType: 'profit', multiplier: 20000, appliesToAll: false,
    specialEffect: 'hdpBonus', hdpBonusFlat: 5000,
  },
  {
    level: 10000, effectType: 'profit', multiplier: 50000, appliesToAll: false,
    specialEffect: 'hdpBonus', hdpBonusFlat: 7500,
  },
  {
    level: 12000, effectType: 'profit', multiplier: 100000, appliesToAll: false,
    specialEffect: 'hdpBonus', hdpBonusFlat: 10000,
  },
];

/**
 * Hall 9: Void Meditation Sanctum -- 20 milestones
 * SPECIAL: Offline earnings multiplier (x1.5 up to x6.0).
 * Primary hall for idle/overnight players.
 */
export const HALL_9_MILESTONES: readonly Milestone[] = [
  { level: 80, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 160, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 300, effectType: 'speed', multiplier: 2, appliesToAll: false },
  {
    level: 500, effectType: 'profit', multiplier: 2, appliesToAll: false,
    specialEffect: 'offlineEfficiency', offlineMultiplier: 1.5,
  },
  { level: 800, effectType: 'profit', multiplier: 3, appliesToAll: false },
  {
    level: 1200, effectType: 'profit', multiplier: 4, appliesToAll: false,
    specialEffect: 'offlineEfficiency', offlineMultiplier: 2.0,
  },
  { level: 1800, effectType: 'profit', multiplier: 5, appliesToAll: false },
  {
    level: 2500, effectType: 'profit', multiplier: 10, appliesToAll: false,
    specialEffect: 'offlineEfficiency', offlineMultiplier: 2.5,
  },
  { level: 3000, effectType: 'profit', multiplier: 20, appliesToAll: false },
  {
    level: 3500, effectType: 'profit', multiplier: 50, appliesToAll: false,
    specialEffect: 'offlineEfficiency', offlineMultiplier: 3.0,
  },
  { level: 4000, effectType: 'profit', multiplier: 100, appliesToAll: false },
  {
    level: 4500, effectType: 'profit', multiplier: 200, appliesToAll: false,
    specialEffect: 'offlineEfficiency', offlineMultiplier: 3.5,
  },
  { level: 5000, effectType: 'profit', multiplier: 500, appliesToAll: false },
  {
    level: 6000, effectType: 'profit', multiplier: 1000, appliesToAll: false,
    specialEffect: 'offlineEfficiency', offlineMultiplier: 4.0,
  },
  { level: 7000, effectType: 'profit', multiplier: 2000, appliesToAll: false },
  {
    level: 8000, effectType: 'profit', multiplier: 5000, appliesToAll: false,
    specialEffect: 'offlineEfficiency', offlineMultiplier: 4.5,
  },
  { level: 9000, effectType: 'profit', multiplier: 10000, appliesToAll: false },
  {
    level: 10000, effectType: 'profit', multiplier: 20000, appliesToAll: false,
    specialEffect: 'offlineEfficiency', offlineMultiplier: 5.0,
  },
  {
    level: 12000, effectType: 'profit', multiplier: 50000, appliesToAll: false,
    specialEffect: 'offlineEfficiency', offlineMultiplier: 5.5,
  },
  {
    level: 15000, effectType: 'profit', multiplier: 100000, appliesToAll: false,
    specialEffect: 'offlineEfficiency', offlineMultiplier: 6.0,
  },
];

/**
 * Hall 10: Soul Tempering Pagoda -- 19 milestones
 * SPECIAL: Amplifies the chosen Dao Path multiplier (x1.2 up to x3.0).
 */
export const HALL_10_MILESTONES: readonly Milestone[] = [
  { level: 100, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 200, effectType: 'speed', multiplier: 2, appliesToAll: false },
  {
    level: 350, effectType: 'profit', multiplier: 2, appliesToAll: false,
    specialEffect: 'daoPathAmplifier', daoPathAmplifier: 1.2,
  },
  { level: 600, effectType: 'profit', multiplier: 3, appliesToAll: false },
  {
    level: 1000, effectType: 'profit', multiplier: 4, appliesToAll: false,
    specialEffect: 'daoPathAmplifier', daoPathAmplifier: 1.4,
  },
  { level: 1500, effectType: 'profit', multiplier: 5, appliesToAll: false },
  {
    level: 2000, effectType: 'profit', multiplier: 10, appliesToAll: false,
    specialEffect: 'daoPathAmplifier', daoPathAmplifier: 1.6,
  },
  { level: 2500, effectType: 'profit', multiplier: 20, appliesToAll: false },
  {
    level: 3000, effectType: 'profit', multiplier: 50, appliesToAll: false,
    specialEffect: 'daoPathAmplifier', daoPathAmplifier: 1.8,
  },
  { level: 3500, effectType: 'profit', multiplier: 100, appliesToAll: false },
  {
    level: 4000, effectType: 'profit', multiplier: 200, appliesToAll: false,
    specialEffect: 'daoPathAmplifier', daoPathAmplifier: 2.0,
  },
  { level: 5000, effectType: 'profit', multiplier: 500, appliesToAll: false },
  {
    level: 6000, effectType: 'profit', multiplier: 1000, appliesToAll: false,
    specialEffect: 'daoPathAmplifier', daoPathAmplifier: 2.2,
  },
  {
    level: 7000, effectType: 'profit', multiplier: 2000, appliesToAll: false,
    specialEffect: 'daoPathAmplifier', daoPathAmplifier: 2.4,
  },
  { level: 8000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
  {
    level: 9000, effectType: 'profit', multiplier: 10000, appliesToAll: false,
    specialEffect: 'daoPathAmplifier', daoPathAmplifier: 2.6,
  },
  {
    level: 10000, effectType: 'profit', multiplier: 20000, appliesToAll: false,
    specialEffect: 'daoPathAmplifier', daoPathAmplifier: 2.8,
  },
  { level: 12000, effectType: 'profit', multiplier: 50000, appliesToAll: false },
  {
    level: 15000, effectType: 'profit', multiplier: 100000, appliesToAll: false,
    specialEffect: 'daoPathAmplifier', daoPathAmplifier: 3.0,
  },
];

/**
 * Hall 11: Celestial Inscription Library -- 18 milestones
 * SPECIAL: Speed milestones give x4 instead of x2. Only 2 speed milestones
 * but x4 each = x16 speed total. The speedrun engine.
 */
export const HALL_11_MILESTONES: readonly Milestone[] = [
  { level: 120, effectType: 'speed', multiplier: 4, appliesToAll: false },
  { level: 300, effectType: 'speed', multiplier: 4, appliesToAll: false },
  { level: 600, effectType: 'profit', multiplier: 3, appliesToAll: false },
  { level: 1000, effectType: 'profit', multiplier: 5, appliesToAll: false },
  { level: 1500, effectType: 'profit', multiplier: 10, appliesToAll: false },
  { level: 2000, effectType: 'profit', multiplier: 20, appliesToAll: false },
  { level: 2500, effectType: 'profit', multiplier: 50, appliesToAll: false },
  { level: 3000, effectType: 'profit', multiplier: 100, appliesToAll: false },
  { level: 3500, effectType: 'profit', multiplier: 200, appliesToAll: false },
  { level: 4000, effectType: 'profit', multiplier: 500, appliesToAll: false },
  { level: 5000, effectType: 'profit', multiplier: 1000, appliesToAll: false },
  { level: 6000, effectType: 'profit', multiplier: 2000, appliesToAll: false },
  { level: 7000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
  { level: 8000, effectType: 'profit', multiplier: 10000, appliesToAll: false },
  { level: 9000, effectType: 'profit', multiplier: 20000, appliesToAll: false },
  { level: 10000, effectType: 'profit', multiplier: 50000, appliesToAll: false },
  { level: 12000, effectType: 'profit', multiplier: 100000, appliesToAll: false },
  { level: 15000, effectType: 'profit', multiplier: 250000, appliesToAll: false },
];

/**
 * Hall 12: Dao Comprehension Throne -- 18 milestones
 * SPECIAL: Heavenly Mandate effectiveness x1.5 per special milestone.
 * At max (7 SPECIALs): x17.1 Mandate effectiveness.
 */
export const HALL_12_MILESTONES: readonly Milestone[] = [
  { level: 150, effectType: 'speed', multiplier: 2, appliesToAll: false },
  {
    level: 350, effectType: 'profit', multiplier: 2, appliesToAll: false,
    specialEffect: 'mandateEffectiveness', mandateMultiplier: 1.5,
  },
  { level: 700, effectType: 'profit', multiplier: 3, appliesToAll: false },
  {
    level: 1000, effectType: 'profit', multiplier: 5, appliesToAll: false,
    specialEffect: 'mandateEffectiveness', mandateMultiplier: 1.5,
  },
  { level: 1500, effectType: 'profit', multiplier: 10, appliesToAll: false },
  {
    level: 2000, effectType: 'profit', multiplier: 20, appliesToAll: false,
    specialEffect: 'mandateEffectiveness', mandateMultiplier: 1.5,
  },
  { level: 2500, effectType: 'profit', multiplier: 50, appliesToAll: false },
  {
    level: 3000, effectType: 'profit', multiplier: 100, appliesToAll: false,
    specialEffect: 'mandateEffectiveness', mandateMultiplier: 1.5,
  },
  { level: 3500, effectType: 'profit', multiplier: 200, appliesToAll: false },
  {
    level: 4000, effectType: 'profit', multiplier: 500, appliesToAll: false,
    specialEffect: 'mandateEffectiveness', mandateMultiplier: 1.5,
  },
  { level: 5000, effectType: 'profit', multiplier: 1000, appliesToAll: false },
  {
    level: 6000, effectType: 'profit', multiplier: 2000, appliesToAll: false,
    specialEffect: 'mandateEffectiveness', mandateMultiplier: 1.5,
  },
  { level: 7000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
  {
    level: 8000, effectType: 'profit', multiplier: 10000, appliesToAll: false,
    specialEffect: 'mandateEffectiveness', mandateMultiplier: 1.5,
  },
  { level: 9000, effectType: 'profit', multiplier: 20000, appliesToAll: false },
  { level: 10000, effectType: 'profit', multiplier: 50000, appliesToAll: false },
  { level: 12000, effectType: 'profit', multiplier: 100000, appliesToAll: false },
  { level: 15000, effectType: 'profit', multiplier: 250000, appliesToAll: false },
];

/** Map of hall ID to its milestones (halls 7-12) */
export const MILESTONE_CONFIGS_7_12: Record<number, readonly Milestone[]> = {
  7: HALL_7_MILESTONES,
  8: HALL_8_MILESTONES,
  9: HALL_9_MILESTONES,
  10: HALL_10_MILESTONES,
  11: HALL_11_MILESTONES,
  12: HALL_12_MILESTONES,
};
