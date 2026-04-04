import Decimal from 'break_infinity.js';

/** Static configuration for a craftable alchemy item */
export interface AlchemyItemConfig {
  /** Unique item identifier (1-10) */
  id: number;
  /** Item display name */
  name: string;
  /** Alchemy Essence cost to craft */
  aeCost: number;
  /** Duration of the buff in seconds */
  durationSeconds: number;
  /** Multiplier applied while the buff is active */
  multiplier: number;
  /** Hall IDs affected by this buff (empty array = special effect like treasure) */
  affectedHallIds: number[];
  /** Hall 3 level required to unlock this recipe */
  unlockLevel: number;
  /** Human-readable effect description */
  effectDescription: string;
}

/** An active buff applied from a crafted pill */
export interface ActiveBuff {
  /** Reference to the AlchemyItemConfig ID */
  itemId: number;
  /** Remaining duration in seconds */
  remainingSeconds: number;
  /** The multiplier this buff provides */
  multiplier: number;
  /** Which hall IDs this buff applies to */
  affectedHallIds: number[];
}

/** Runtime alchemy state */
export interface AlchemyState {
  /** Currently active buffs */
  activeBuffs: ActiveBuff[];
  /** Current Alchemy Essence stockpile (also in Currencies, mirrored here for convenience) */
  alchemyEssence: Decimal;
  /** Base AE generation rate per second (from Hall 3 level) */
  baseAePerSecond: number;
  /** Bonus AE per second from milestones */
  bonusAePerSecond: number;
}
