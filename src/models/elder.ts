import Decimal from 'break_infinity.js';

/** Static configuration for an Elder who automates a hall */
export interface ElderConfig {
  /** Unique elder identifier (1-12, matches hall ID) */
  id: number;
  /** Display name */
  name: string;
  /** Title / epithet */
  title: string;
  /** The hall this elder automates (1-12) */
  hallId: number;
  /** Cost in Spirit Stones to hire */
  cost: Decimal;
  /** Brief lore description */
  description: string;
}

/** Runtime state of an elder */
export interface ElderState {
  /** Elder config ID */
  elderId: number;
  /** Whether the elder has been hired */
  hired: boolean;
}
