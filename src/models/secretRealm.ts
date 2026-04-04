import Decimal from 'break_infinity.js';
import { SpiritualRoot } from './disciple';

/** Static configuration for a Secret Realm */
export interface SecretRealmConfig {
  /** Unique realm identifier */
  id: string;
  /** Display name */
  name: string;
  /** Elemental affinity */
  element: SpiritualRoot;
  /** Connected cultivation hall ID */
  connectedHallId: number;
  /** Environmental effect description */
  environmentalEffect: string;
  /** Total number of floors */
  totalFloors: number;
}

/** Idle farming reward rates per highest cleared floor tier */
export interface IdleFarmingTier {
  /** Minimum highest cleared floor for this tier */
  minFloor: number;
  /** Spirit Stones per hour */
  ssPerHour: Decimal;
  /** Recruitment Tokens per hour */
  rtPerHour: number;
  /** Alchemy Essence per hour */
  aePerHour: number;
}

/** Push attempt reward rates per floor tier */
export interface PushRewardTier {
  /** Minimum floor number for this tier */
  minFloor: number;
  /** Maximum floor number for this tier */
  maxFloor: number;
  /** Spirit Stones per clear */
  ssPerClear: Decimal;
  /** Recruitment Tokens per clear */
  rtPerClear: number;
  /** Alchemy Essence per clear */
  aePerClear: number;
  /** Ability Scroll drop chance (0-1) */
  abilityScrollChance: number;
  /** Rare+ Disciple Shard drop chance (0-1) */
  rareShardChance: number;
  /** Epic Disciple Shard drop chance (0-1) */
  epicShardChance: number;
  /** Legendary Shard drop chance (0-1) */
  legendaryShardChance: number;
}

/** Boss definition for a specific floor */
export interface BossConfig {
  /** Floor number where this boss appears */
  floor: number;
  /** Boss name */
  name: string;
  /** Special mechanic description */
  mechanic: string;
}

/** Enemy stat scaling data for a single floor */
export interface FloorData {
  /** Floor number */
  floor: number;
  /** Enemy HP at this floor */
  enemyHp: number;
  /** Enemy ATK at this floor */
  enemyAtk: number;
  /** Enemy DEF at this floor */
  enemyDef: number;
  /** Recommended team power */
  recommendedPower: number;
}

/** Ability absorption rates by enemy type */
export interface AbsorptionRateConfig {
  /** Enemy type label */
  enemyType: string;
  /** Absorption chance (0-1) */
  chance: number;
}

/** Absorbed ability template from dungeon enemies */
export interface AbsorbedAbilityConfig {
  /** Ability name */
  name: string;
  /** Source floor range or boss name */
  source: string;
  /** Effect description */
  effect: string;
  /** Max stacks (1 for boss abilities, Infinity for stat decay abilities) */
  maxStacks: number;
}

/** A push attempt result */
export interface PushAttempt {
  /** Realm ID */
  realmId: string;
  /** Floor reached */
  floorReached: number;
  /** Whether the attempt succeeded (cleared the floor) */
  succeeded: boolean;
  /** Loot collected */
  lootCollected: {
    spiritStones: Decimal;
    recruitmentTokens: number;
    alchemyEssence: number;
  };
  /** Disciple instance IDs that died */
  deadDiscipleIds: string[];
  /** Retreat type if retreated */
  retreatType: 'voluntary' | 'emergency' | 'wipe' | null;
}

/** Retreat loot retention percentages */
export interface RetreatConfig {
  /** Retreat between floors: percentage of loot kept */
  voluntaryLootPercent: number;
  /** Retreat during battle: percentage of loot kept */
  emergencyLootPercent: number;
  /** Total wipe: percentage of loot kept */
  wipeLootPercent: number;
}

/** Runtime state for a single Secret Realm */
export interface SecretRealmState {
  /** Realm config ID */
  realmId: string;
  /** Highest floor ever cleared (persists through Ascension for idle farming) */
  highestFloorEver: number;
  /** Highest floor cleared this Ascension run */
  highestFloorThisRun: number;
  /** Disciple IDs currently idle farming in this realm */
  idleFarmingDiscipleIds: string[];
  /** Accumulated uncollected idle rewards (cap at 12 hours) */
  uncollectedIdleHours: number;
  /** Realm keys available */
  realmKeys: number;
  /** Timestamp of last key regeneration */
  lastKeyRegenTimestamp: number;
}
