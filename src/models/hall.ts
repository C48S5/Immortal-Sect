import Decimal from 'break_infinity.js';

/** Type of milestone effect */
export type MilestoneEffectType =
  | 'speed'
  | 'profit'
  | 'allProfit'
  | 'allSpeed'
  | 'aeGeneration'
  | 'costReduction';

/** Defines a single milestone threshold for a hall */
export interface Milestone {
  /** Level at which this milestone activates */
  level: number;
  /** Type of effect this milestone provides */
  effectType: MilestoneEffectType;
  /** Multiplier value (e.g. 2 means x2) */
  multiplier: number;
  /** If true, applies to ALL halls instead of just the owning hall */
  appliesToAll: boolean;
  /** Optional special effect description (e.g. AE bonus, cost reduction) */
  specialEffect?: string;
  /** Optional AE per second bonus granted at this milestone */
  aeBonusPerSecond?: number;
}

/** Elemental affinity for a cultivation hall */
export type HallElement =
  | 'neutral'
  | 'fire'
  | 'water'
  | 'wood'
  | 'metal'
  | 'earth';

/** Static configuration for a cultivation hall (immutable game data) */
export interface HallConfig {
  /** Unique hall identifier (1-12) */
  id: number;
  /** Display name */
  name: string;
  /** Base cost to purchase the first unit */
  baseCost: Decimal;
  /** Cost coefficient for exponential scaling: cost = baseCost * coeff^(N-1) */
  coefficient: number;
  /** Base cycle duration in seconds */
  cycleSeconds: number;
  /** Base revenue per cycle per unit owned */
  baseRevenue: Decimal;
  /** Elemental affinity of this hall */
  element: HallElement;
  /** Matching spiritual root for element bonus */
  matchingRoot: string;
  /** Brief lore/description */
  description: string;
}

/** Runtime state of a single cultivation hall */
export interface HallState {
  /** Hall config ID reference */
  hallId: number;
  /** Number of units owned */
  level: number;
  /** Whether this hall has been unlocked */
  unlocked: boolean;
  /** Current cycle progress in seconds (0 to cycleSeconds) */
  cycleProgress: number;
  /** Whether this hall is currently running its cycle */
  isRunning: boolean;
  /** Accumulated milestone speed multiplier */
  milestoneSpeedMult: number;
  /** Accumulated milestone profit multiplier */
  milestoneProfitMult: number;
  /** Assigned disciple ID, if any */
  assignedDiscipleId: string | null;
  /** Assigned elder ID, if any */
  assignedElderId: number | null;
}
