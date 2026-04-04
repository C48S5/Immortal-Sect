/** Dao Path spell definition */
export interface DaoSpell {
  /** Spell name */
  name: string;
  /** Active duration in seconds */
  activeDuration: number;
  /** Cooldown in seconds */
  cooldown: number;
  /** Human-readable effect description */
  effectDescription: string;
}

/** Static configuration for a Dao Path */
export interface DaoPathConfig {
  /** Unique path identifier (1-5) */
  id: number;
  /** Display name */
  name: string;
  /** Hall IDs that receive the primary multiplier */
  boostedHallIds: number[];
  /** Multiplier applied to boosted halls */
  hallMultiplier: number;
  /** Passive bonus description */
  passiveDescription: string;
  /** Passive bonus value (varies by type) */
  passiveValue: number;
  /** The active spell granted by this path */
  spell: DaoSpell;
}

/** Runtime state of a player's Dao Path */
export interface DaoPathState {
  /** Selected Dao Path ID (null if none selected) */
  selectedPathId: number | null;
  /** Whether the spell is currently active */
  spellActive: boolean;
  /** Remaining active duration in seconds */
  spellRemainingDuration: number;
  /** Remaining cooldown in seconds */
  spellCooldownRemaining: number;
}
