/** Disciple rarity tiers */
export enum Rarity {
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
}

/** Spiritual root element types */
export enum SpiritualRoot {
  Fire = 'fire',
  Water = 'water',
  Wood = 'wood',
  Metal = 'metal',
  Earth = 'earth',
}

/** Base stats for a disciple */
export interface DiscipleStats {
  /** Hit points */
  hp: number;
  /** Attack power */
  atk: number;
  /** Defense */
  def: number;
  /** Speed */
  spd: number;
}

/** An absorbed ability occupying a slot */
export interface AbilitySlot {
  /** Ability name */
  name: string;
  /** Floor range or boss where this was absorbed */
  source: string;
  /** Effect description */
  effect: string;
  /** Maximum stacks (1 for boss abilities, Infinity for stat abilities) */
  maxStacks: number;
  /** Current stack count */
  stacks: number;
}

/** Innate combat ability (does not occupy a slot) */
export interface CombatAbility {
  /** Ability name */
  name: string;
  /** Effect description */
  description: string;
}

/** Hall passive bonus provided when this disciple is assigned */
export interface HallPassive {
  /** Human-readable description */
  description: string;
}

/** Static configuration for a disciple template */
export interface DiscipleConfig {
  /** Unique template identifier */
  id: string;
  /** Display name (English) */
  name: string;
  /** Chinese characters for the name */
  chineseName: string;
  /** Rarity tier */
  rarity: Rarity;
  /** Elemental spiritual root */
  root: SpiritualRoot;
  /** Base stats */
  stats: DiscipleStats;
  /** Number of ability slots (Common: 1, Uncommon: 1, Rare: 2, Epic: 2, Legendary: 3) */
  abilitySlots: number;
  /** Hall passive bonus when assigned */
  hallPassive: HallPassive;
  /** Innate combat ability */
  combatAbility: CombatAbility;
  /** Lore text */
  lore: string;
}

/** A live disciple instance owned by the player */
export interface Disciple {
  /** Unique instance ID */
  instanceId: string;
  /** Reference to the DiscipleConfig template ID */
  configId: string;
  /** Current absorbed abilities (may be fewer than max slots) */
  absorbedAbilities: AbilitySlot[];
  /** Which hall this disciple is assigned to (null if unassigned or in dungeon) */
  assignedHallId: number | null;
  /** Which secret realm this disciple is deployed to (null if in hall or idle) */
  deployedRealmId: string | null;
  /** Whether this disciple is alive */
  alive: boolean;
  /** Whether this disciple is injured (can't push for 1 hour) */
  injured: boolean;
  /** Timestamp when injury heals (0 if not injured) */
  injuryHealsAt: number;
}

/** Pull rate configuration per rarity */
export interface PullRateConfig {
  /** Rarity tier */
  rarity: Rarity;
  /** Base pull rate as a decimal (e.g. 0.52 = 52%) */
  rate: number;
  /** Number of ability slots for this rarity */
  abilitySlots: number;
  /** Qi Residue dropped on death */
  qiResidueOnDeath: number;
  /** Base DiscipleBonus multiplier when assigned to a hall */
  rarityMultiplier: number;
}

/** Gacha system configuration */
export interface GachaConfig {
  /** Cost per single pull in RT */
  singlePullCost: number;
  /** Cost per 10-pull in RT (10% discount) */
  tenPullCost: number;
  /** Hard pity: guaranteed Epic+ every N pulls */
  hardPityPulls: number;
  /** Spark: choose any Legendary after N total pulls */
  sparkPulls: number;
  /** Pull rates per rarity tier */
  pullRates: PullRateConfig[];
}
