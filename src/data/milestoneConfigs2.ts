import type { Milestone } from '../models/hall';

/**
 * Hall 7: Sword Refinement Peak -- 22 milestones
 * SPECIAL: +crit chance to Heavenly Treasures
 */
export const HALL_7_MILESTONES: readonly Milestone[] = [
  { level: 25, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 50, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 100, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 150, effectType: 'profit', multiplier: 2, appliesToAll: false },
  {
    level: 200, effectType: 'speed', multiplier: 2, appliesToAll: false,
    specialEffect: 'treasureCrit',
  },
  { level: 300, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 400, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 500, effectType: 'profit', multiplier: 2, appliesToAll: false },
  {
    level: 600, effectType: 'profit', multiplier: 3, appliesToAll: false,
    specialEffect: 'treasureCrit',
  },
  { level: 800, effectType: 'profit', multiplier: 4, appliesToAll: false },
  {
    level: 1000, effectType: 'profit', multiplier: 5, appliesToAll: false,
    specialEffect: 'treasureCrit',
  },
  { level: 1250, effectType: 'profit', multiplier: 10, appliesToAll: false },
  { level: 1500, effectType: 'profit', multiplier: 10, appliesToAll: false },
  {
    level: 2000, effectType: 'profit', multiplier: 20, appliesToAll: false,
    specialEffect: 'treasureCrit',
  },
  { level: 2500, effectType: 'profit', multiplier: 50, appliesToAll: false },
  { level: 3000, effectType: 'profit', multiplier: 100, appliesToAll: false },
  {
    level: 4000, effectType: 'profit', multiplier: 200, appliesToAll: false,
    specialEffect: 'treasureCrit',
  },
  { level: 5000, effectType: 'profit', multiplier: 500, appliesToAll: false },
  { level: 6000, effectType: 'profit', multiplier: 1000, appliesToAll: false },
  { level: 7000, effectType: 'profit', multiplier: 2000, appliesToAll: false },
  { level: 8000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
  { level: 10000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
];

/**
 * Hall 8: Tribulation Lightning Tower -- 22 milestones
 * SPECIAL: +HDP per Ascension per SPECIAL milestone
 */
export const HALL_8_MILESTONES: readonly Milestone[] = [
  { level: 25, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 50, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 100, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 150, effectType: 'profit', multiplier: 2, appliesToAll: false },
  {
    level: 200, effectType: 'speed', multiplier: 2, appliesToAll: false,
    specialEffect: 'hdpBonus',
  },
  { level: 300, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 400, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 500, effectType: 'profit', multiplier: 2, appliesToAll: false },
  {
    level: 600, effectType: 'profit', multiplier: 3, appliesToAll: false,
    specialEffect: 'hdpBonus',
  },
  { level: 800, effectType: 'profit', multiplier: 4, appliesToAll: false },
  {
    level: 1000, effectType: 'profit', multiplier: 5, appliesToAll: false,
    specialEffect: 'hdpBonus',
  },
  { level: 1250, effectType: 'profit', multiplier: 10, appliesToAll: false },
  { level: 1500, effectType: 'profit', multiplier: 10, appliesToAll: false },
  {
    level: 2000, effectType: 'profit', multiplier: 20, appliesToAll: false,
    specialEffect: 'hdpBonus',
  },
  { level: 2500, effectType: 'profit', multiplier: 50, appliesToAll: false },
  { level: 3000, effectType: 'profit', multiplier: 100, appliesToAll: false },
  {
    level: 4000, effectType: 'profit', multiplier: 200, appliesToAll: false,
    specialEffect: 'hdpBonus',
  },
  { level: 5000, effectType: 'profit', multiplier: 500, appliesToAll: false },
  { level: 6000, effectType: 'profit', multiplier: 1000, appliesToAll: false },
  { level: 7000, effectType: 'profit', multiplier: 2000, appliesToAll: false },
  { level: 8000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
  { level: 10000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
];

/**
 * Hall 9: Void Meditation Sanctum -- 22 milestones
 * SPECIAL: +offline efficiency multiplier per SPECIAL (up to x6)
 */
export const HALL_9_MILESTONES: readonly Milestone[] = [
  { level: 25, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 50, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 100, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 150, effectType: 'profit', multiplier: 2, appliesToAll: false },
  {
    level: 200, effectType: 'speed', multiplier: 2, appliesToAll: false,
    specialEffect: 'offlineEfficiency',
  },
  { level: 300, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 400, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 500, effectType: 'profit', multiplier: 2, appliesToAll: false },
  {
    level: 600, effectType: 'profit', multiplier: 3, appliesToAll: false,
    specialEffect: 'offlineEfficiency',
  },
  { level: 800, effectType: 'profit', multiplier: 4, appliesToAll: false },
  {
    level: 1000, effectType: 'profit', multiplier: 5, appliesToAll: false,
    specialEffect: 'offlineEfficiency',
  },
  { level: 1250, effectType: 'profit', multiplier: 10, appliesToAll: false },
  { level: 1500, effectType: 'profit', multiplier: 10, appliesToAll: false },
  {
    level: 2000, effectType: 'profit', multiplier: 20, appliesToAll: false,
    specialEffect: 'offlineEfficiency',
  },
  { level: 2500, effectType: 'profit', multiplier: 50, appliesToAll: false },
  { level: 3000, effectType: 'profit', multiplier: 100, appliesToAll: false },
  {
    level: 4000, effectType: 'profit', multiplier: 200, appliesToAll: false,
    specialEffect: 'offlineEfficiency',
  },
  { level: 5000, effectType: 'profit', multiplier: 500, appliesToAll: false },
  { level: 6000, effectType: 'profit', multiplier: 1000, appliesToAll: false },
  { level: 7000, effectType: 'profit', multiplier: 2000, appliesToAll: false },
  { level: 8000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
  { level: 10000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
];

/**
 * Hall 10: Soul Tempering Pagoda -- 22 milestones
 * SPECIAL: +Heavenly Treasure value per SPECIAL
 */
export const HALL_10_MILESTONES: readonly Milestone[] = [
  { level: 25, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 50, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 100, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 150, effectType: 'profit', multiplier: 2, appliesToAll: false },
  {
    level: 200, effectType: 'speed', multiplier: 2, appliesToAll: false,
    specialEffect: 'treasureValue',
  },
  { level: 300, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 400, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 500, effectType: 'profit', multiplier: 2, appliesToAll: false },
  {
    level: 600, effectType: 'profit', multiplier: 3, appliesToAll: false,
    specialEffect: 'treasureValue',
  },
  { level: 800, effectType: 'profit', multiplier: 4, appliesToAll: false },
  {
    level: 1000, effectType: 'profit', multiplier: 5, appliesToAll: false,
    specialEffect: 'treasureValue',
  },
  { level: 1250, effectType: 'profit', multiplier: 10, appliesToAll: false },
  { level: 1500, effectType: 'profit', multiplier: 10, appliesToAll: false },
  {
    level: 2000, effectType: 'profit', multiplier: 20, appliesToAll: false,
    specialEffect: 'treasureValue',
  },
  { level: 2500, effectType: 'profit', multiplier: 50, appliesToAll: false },
  { level: 3000, effectType: 'profit', multiplier: 100, appliesToAll: false },
  {
    level: 4000, effectType: 'profit', multiplier: 200, appliesToAll: false,
    specialEffect: 'treasureValue',
  },
  { level: 5000, effectType: 'profit', multiplier: 500, appliesToAll: false },
  { level: 6000, effectType: 'profit', multiplier: 1000, appliesToAll: false },
  { level: 7000, effectType: 'profit', multiplier: 2000, appliesToAll: false },
  { level: 8000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
  { level: 10000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
];

/**
 * Hall 11: Celestial Inscription Library -- 22 milestones
 * SPECIAL: +Dao Path spell effectiveness per SPECIAL
 */
export const HALL_11_MILESTONES: readonly Milestone[] = [
  { level: 25, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 50, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 100, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 150, effectType: 'profit', multiplier: 2, appliesToAll: false },
  {
    level: 200, effectType: 'speed', multiplier: 2, appliesToAll: false,
    specialEffect: 'daoSpellPower',
  },
  { level: 300, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 400, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 500, effectType: 'profit', multiplier: 2, appliesToAll: false },
  {
    level: 600, effectType: 'profit', multiplier: 3, appliesToAll: false,
    specialEffect: 'daoSpellPower',
  },
  { level: 800, effectType: 'profit', multiplier: 4, appliesToAll: false },
  {
    level: 1000, effectType: 'profit', multiplier: 5, appliesToAll: false,
    specialEffect: 'daoSpellPower',
  },
  { level: 1250, effectType: 'profit', multiplier: 10, appliesToAll: false },
  { level: 1500, effectType: 'profit', multiplier: 10, appliesToAll: false },
  {
    level: 2000, effectType: 'profit', multiplier: 20, appliesToAll: false,
    specialEffect: 'daoSpellPower',
  },
  { level: 2500, effectType: 'profit', multiplier: 50, appliesToAll: false },
  { level: 3000, effectType: 'profit', multiplier: 100, appliesToAll: false },
  {
    level: 4000, effectType: 'profit', multiplier: 200, appliesToAll: false,
    specialEffect: 'daoSpellPower',
  },
  { level: 5000, effectType: 'profit', multiplier: 500, appliesToAll: false },
  { level: 6000, effectType: 'profit', multiplier: 1000, appliesToAll: false },
  { level: 7000, effectType: 'profit', multiplier: 2000, appliesToAll: false },
  { level: 8000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
  { level: 10000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
];

/**
 * Hall 12: Dao Comprehension Throne -- 22 milestones
 * SPECIAL: +Mandate effectiveness per SPECIAL
 */
export const HALL_12_MILESTONES: readonly Milestone[] = [
  { level: 25, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 50, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 100, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 150, effectType: 'profit', multiplier: 2, appliesToAll: false },
  {
    level: 200, effectType: 'speed', multiplier: 2, appliesToAll: false,
    specialEffect: 'mandateEffectiveness',
  },
  { level: 300, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 400, effectType: 'speed', multiplier: 2, appliesToAll: false },
  { level: 500, effectType: 'profit', multiplier: 2, appliesToAll: false },
  {
    level: 600, effectType: 'profit', multiplier: 3, appliesToAll: false,
    specialEffect: 'mandateEffectiveness',
  },
  { level: 800, effectType: 'profit', multiplier: 4, appliesToAll: false },
  {
    level: 1000, effectType: 'profit', multiplier: 5, appliesToAll: false,
    specialEffect: 'mandateEffectiveness',
  },
  { level: 1250, effectType: 'profit', multiplier: 10, appliesToAll: false },
  { level: 1500, effectType: 'profit', multiplier: 10, appliesToAll: false },
  {
    level: 2000, effectType: 'profit', multiplier: 20, appliesToAll: false,
    specialEffect: 'mandateEffectiveness',
  },
  { level: 2500, effectType: 'profit', multiplier: 50, appliesToAll: false },
  { level: 3000, effectType: 'profit', multiplier: 100, appliesToAll: false },
  {
    level: 4000, effectType: 'profit', multiplier: 200, appliesToAll: false,
    specialEffect: 'mandateEffectiveness',
  },
  { level: 5000, effectType: 'profit', multiplier: 500, appliesToAll: false },
  { level: 6000, effectType: 'profit', multiplier: 1000, appliesToAll: false },
  { level: 7000, effectType: 'profit', multiplier: 2000, appliesToAll: false },
  { level: 8000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
  { level: 10000, effectType: 'profit', multiplier: 5000, appliesToAll: false },
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
