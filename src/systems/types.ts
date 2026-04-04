/**
 * Shared types used across game systems.
 * Aggregates references to model types and defines the GameState shape
 * that systems read from. Stores own the actual state; systems are pure consumers.
 */
import Decimal from 'break_infinity.js';
import type { HallConfig, HallState, HallElement } from '@models/hall';
import type { Currencies } from '@models/currency';
import type { ElderConfig, ElderState } from '@models/elder';
import type { Disciple, DiscipleConfig, GachaConfig } from '@models/disciple';
import type { DaoPathConfig, DaoPathState } from '@models/daoPath';
import type { ChallengeConfig, ChallengeState } from '@models/challenge';
import type { AlchemyItemConfig, ActiveBuff, AlchemyState } from '@models/alchemy';

// Re-export for convenience
export type {
  HallConfig, HallState, HallElement,
  Currencies,
  ElderConfig, ElderState,
  Disciple, DiscipleConfig, GachaConfig,
  DaoPathConfig, DaoPathState,
  ChallengeConfig, ChallengeState,
  AlchemyItemConfig, ActiveBuff, AlchemyState,
};

/** Mandate slot for a single hall */
export interface MandateSlot {
  hallId: number;
  level: number; // 0-4 (0 = not purchased)
}

/** Automation unlock tier */
export interface AutomationTier {
  hdpThreshold: number;
  description: string;
  unlocked: boolean;
}

/** Dungeon realm definition */
export interface DungeonRealm {
  id: string;
  name: string;
  element: HallElement;
}

/** Dungeon runtime state per realm */
export interface DungeonRealmState {
  realmId: string;
  highestFloor: number;
  currentFloor: number;
  idleFarmingAccumulated: number; // seconds of accumulated idle time (cap 43200 = 12h)
  realmKeys: number;
  lastKeyRegenTime: number; // timestamp
}

/** Legacy fragment from disciple death */
export interface LegacyFragment {
  discipleConfigId: string;
  type: 'minor' | 'major' | 'mythic';
  legacyPower: number;
  traitName?: string;
  traitPower?: number;
}

/** Qi Residue shop buff */
export interface QiResidueBuffConfig {
  id: number;
  name: string;
  description: string;
  cost: number;
  maxPurchases: number;
  effect: { type: string; value: number };
}

/** Legacy system state */
export interface LegacyState {
  legacyPower: number;
  fragments: LegacyFragment[];
  qiResidueBuffsPurchased: Record<number, number>; // buffId -> count
}

/** Spell active state for DaoPathSystem */
export interface SpellActiveState {
  hallMultipliers: Record<number, number>; // hallId -> current spell mult
  globalMultiplier: number;
  aeMultiplier: number;
  treasureRateMultiplier: number;
}

/** Aggregated game state that systems read from */
export interface GameStateSnapshot {
  currencies: Currencies;
  halls: HallState[];
  hallConfigs: HallConfig[];
  elders: ElderState[];
  elderConfigs: ElderConfig[];
  disciples: Disciple[];
  discipleConfigs: DiscipleConfig[];
  daoPath: DaoPathState;
  daoPathConfigs: DaoPathConfig[];
  challenges: ChallengeState[];
  challengeConfigs: ChallengeConfig[];
  alchemy: AlchemyState;
  alchemyConfigs: AlchemyItemConfig[];
  mandates: MandateSlot[];
  automation: AutomationTier[];
  dungeonRealms: DungeonRealmState[];
  legacy: LegacyState;
  gachaConfig: GachaConfig;
  totalPulls: number;
  pullsSinceLastEpic: number;
  spellState: SpellActiveState;
  totalEarnings: Decimal; // lifetime SS earned (for HDP calc)
  ascensionCount: number;
  hdpSpent: number;
  /** Timestamp helpers */
  now: number;
}

/** Result of an Ascension reset */
export interface ResetResult {
  hdpGained: number;
  totalHdp: number;
  resetFields: string[];
  preservedFields: string[];
}

/** Result of a spell activation */
export interface SpellResult {
  success: boolean;
  spellName: string;
  duration: number;
  cooldown: number;
  message: string;
}

/** Passive bonus from a Dao Path */
export interface PassiveEffect {
  type: 'aeReduction' | 'treasureBonus' | 'cycleReduction' | 'hdpBonus' | 'realmKeyRegen';
  value: number;
  description: string;
}

/** Result from processing disciple death */
export interface LegacyResult {
  qiResidue: number;
  fragment: LegacyFragment | null;
  legacyPowerGained: number;
  message: string;
}

/** Retreat outcome */
export interface RetreatResult {
  lootPercentage: number;
  injuryDuration: number; // 0 = safe, 3600 = 1h injury, -1 = permadeath
  message: string;
}

/** Push attempt result */
export interface PushResult {
  floorsCleared: number;
  loot: { itemId: string; quantity: number }[];
  abilityAbsorbed: string | null;
  retreatResult: RetreatResult | null;
  bossDefeated: boolean;
}
