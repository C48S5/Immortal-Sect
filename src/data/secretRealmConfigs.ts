import Decimal from 'break_infinity.js';
import { SpiritualRoot } from '../models/disciple';
import type {
  SecretRealmConfig,
  IdleFarmingTier,
  PushRewardTier,
  BossConfig,
  AbsorptionRateConfig,
  AbsorbedAbilityConfig,
  RetreatConfig,
} from '../models/secretRealm';

/** All 5 Secret Realm configurations */
export const SECRET_REALM_CONFIGS: readonly SecretRealmConfig[] = [
  {
    id: 'verdant-spirit-forest',
    name: 'Verdant Spirit Forest',
    element: SpiritualRoot.Wood,
    connectedHallId: 5,
    environmentalEffect: 'Poison DoT on all units every 10s; Wood disciples immune',
    totalFloors: 100,
  },
  {
    id: 'crimson-flame-caverns',
    name: 'Crimson Flame Caverns',
    element: SpiritualRoot.Fire,
    connectedHallId: 3,
    environmentalEffect: 'Burning ground tiles; Fire disciples heal from fire damage',
    totalFloors: 100,
  },
  {
    id: 'abyssal-tide-grotto',
    name: 'Abyssal Tide Grotto',
    element: SpiritualRoot.Water,
    connectedHallId: 9,
    environmentalEffect: 'Frozen floors slow SPD by 20%; Water disciples gain +20% SPD instead',
    totalFloors: 100,
  },
  {
    id: 'iron-bone-mountains',
    name: 'Iron Bone Mountains',
    element: SpiritualRoot.Metal,
    connectedHallId: 7,
    environmentalEffect: 'Enemies have +15% DEF; Metal disciples ignore bonus DEF',
    totalFloors: 100,
  },
  {
    id: 'earthen-core-depths',
    name: 'Earthen Core Depths',
    element: SpiritualRoot.Earth,
    connectedHallId: 4,
    environmentalEffect: 'Cave-ins deal AoE damage every 15s; Earth disciples take 50% less',
    totalFloors: 100,
  },
];

/** Idle farming reward tiers based on highest cleared floor */
export const IDLE_FARMING_TIERS: readonly IdleFarmingTier[] = [
  { minFloor: 10, ssPerHour: new Decimal(500), rtPerHour: 10, aePerHour: 2 },
  { minFloor: 25, ssPerHour: new Decimal(5000), rtPerHour: 25, aePerHour: 10 },
  { minFloor: 50, ssPerHour: new Decimal(100000), rtPerHour: 50, aePerHour: 50 },
  { minFloor: 75, ssPerHour: new Decimal(1e7), rtPerHour: 100, aePerHour: 200 },
  { minFloor: 100, ssPerHour: new Decimal(1e9), rtPerHour: 200, aePerHour: 1000 },
];

/** Push attempt reward tiers */
export const PUSH_REWARD_TIERS: readonly PushRewardTier[] = [
  {
    minFloor: 1, maxFloor: 10,
    ssPerClear: new Decimal(1000), rtPerClear: 30, aePerClear: 5,
    abilityScrollChance: 0, rareShardChance: 0, epicShardChance: 0, legendaryShardChance: 0,
  },
  {
    minFloor: 11, maxFloor: 25,
    ssPerClear: new Decimal(25000), rtPerClear: 60, aePerClear: 25,
    abilityScrollChance: 0.10, rareShardChance: 0, epicShardChance: 0, legendaryShardChance: 0,
  },
  {
    minFloor: 26, maxFloor: 50,
    ssPerClear: new Decimal(500000), rtPerClear: 100, aePerClear: 100,
    abilityScrollChance: 0.15, rareShardChance: 0.05, epicShardChance: 0, legendaryShardChance: 0,
  },
  {
    minFloor: 51, maxFloor: 75,
    ssPerClear: new Decimal(5e7), rtPerClear: 150, aePerClear: 500,
    abilityScrollChance: 0.20, rareShardChance: 0, epicShardChance: 0.03, legendaryShardChance: 0,
  },
  {
    minFloor: 76, maxFloor: 100,
    ssPerClear: new Decimal(5e9), rtPerClear: 250, aePerClear: 2000,
    abilityScrollChance: 0.25, rareShardChance: 0, epicShardChance: 0, legendaryShardChance: 0.01,
  },
];

/** Boss configurations for every 10 floors */
export const BOSS_CONFIGS: readonly BossConfig[] = [
  { floor: 10, name: 'Spirit Beast Alpha', mechanic: 'Enrages below 30% HP: +50% ATK' },
  { floor: 20, name: 'Corrupted Elder', mechanic: 'Summons 2 adds every 15s' },
  { floor: 30, name: 'Flame Serpent King', mechanic: 'AoE fire breath every 10s; back row vulnerable' },
  { floor: 40, name: 'Iron Golem', mechanic: 'Damage reflection (20%) for 5s phases' },
  { floor: 50, name: 'Realm Guardian', mechanic: 'Two phases: melee + ranged; element shifts mid-fight' },
  { floor: 60, name: 'Void Wraith', mechanic: 'Drains 5% max HP/s from highest HP ally' },
  { floor: 70, name: 'Thunder Tribulation Beast', mechanic: 'Lightning strikes random disciple for 40% HP every 8s' },
  { floor: 80, name: 'Ancient Formation Array', mechanic: 'Rotating damage zones; only safe spot shifts' },
  { floor: 90, name: 'Fallen Sword Saint', mechanic: 'Mirrors your team\'s highest ATK disciple\'s abilities' },
  { floor: 100, name: 'Heavenly Tribulation Manifestation', mechanic: 'All mechanics combined; 3 phases; guaranteed Legendary ability scroll' },
];

/** Ability absorption rates by enemy type */
export const ABSORPTION_RATES: readonly AbsorptionRateConfig[] = [
  { enemyType: 'Normal enemy', chance: 0 },
  { enemyType: 'Elite enemy (every 5 floors)', chance: 0.06 },
  { enemyType: 'Mini-boss (every 10 floors)', chance: 0.15 },
  { enemyType: 'Realm Boss (floors 25, 50, 75, 100)', chance: 0.40 },
];

/** Absorbed ability templates from dungeon enemies */
export const ABSORBED_ABILITY_CONFIGS: readonly AbsorbedAbilityConfig[] = [
  { name: 'Iron Skin', source: '1-25 elites', effect: '+DEF (exponential decay formula)', maxStacks: Infinity },
  { name: 'Qi Surge', source: '1-25 elites', effect: '+ATK (exponential decay formula)', maxStacks: Infinity },
  { name: 'Shadow Step', source: '26-50 elites', effect: '+SPD (exponential decay formula)', maxStacks: Infinity },
  { name: 'Flame Aura', source: 'Fire Realm bosses', effect: '+15% fire damage (flat, no stacking)', maxStacks: 1 },
  { name: 'Frost Armor', source: 'Water Realm bosses', effect: '-20% damage taken from melee (flat)', maxStacks: 1 },
  { name: 'Earthen Fortitude', source: 'Earth Realm bosses', effect: '+30% max HP (flat)', maxStacks: 1 },
  { name: 'Sword Intent', source: 'Metal Realm bosses', effect: '+25% crit damage (flat)', maxStacks: 1 },
  { name: 'Nature\'s Veil', source: 'Wood Realm bosses', effect: '15% evasion (flat)', maxStacks: 1 },
  { name: 'Heavenly Tribulation Resistance', source: 'Floor 100 boss', effect: 'Survive one lethal hit at 1 HP per battle', maxStacks: 1 },
];

/**
 * Anti-power-stacking formula constants.
 * Bonus = MaxBonus * (1 - e^(-0.3 * stacks))
 */
export const ABILITY_STACKING = {
  /** Decay rate in the exponential formula */
  decayRate: 0.3,
  /** Maximum bonus caps per stat type */
  maxBonusCaps: {
    atk: 2.0,
    def: 1.5,
    hp: 2.5,
    spd: 1.0,
  },
} as const;

/** Enemy stat scaling formulas (base * growth^(floor-1)) */
export const ENEMY_SCALING = {
  hp: { base: 100, growth: 1.08 },
  atk: { base: 20, growth: 1.07 },
  def: { base: 15, growth: 1.06 },
} as const;

/** Retreat loot retention configuration */
export const RETREAT_CONFIG: RetreatConfig = {
  voluntaryLootPercent: 1.0,
  emergencyLootPercent: 0.6,
  wipeLootPercent: 0.3,
};

/** Realm key configuration */
export const REALM_KEY_CONFIG = {
  /** Maximum keys per day from natural regen */
  maxDailyKeys: 5,
  /** Hours to regenerate one key */
  regenHours: 4,
  /** Maximum key storage cap */
  maxStoredKeys: 10,
  /** Maximum uncollected idle hours before cap */
  maxIdleHours: 12,
} as const;
