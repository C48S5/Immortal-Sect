/** A single Heavenly Mandate slot for a hall */
export interface MandateSlot {
  /** Hall ID this slot is assigned to (1-12) */
  hallId: number;
  /** Current mandate level (0-4, where 0 = not purchased) */
  level: number;
}

/** Static configuration for a mandate level */
export interface MandateLevelConfig {
  /** Level number (1-4) */
  level: number;
  /** Multiplier applied to the assigned hall */
  multiplier: number;
  /** Heavenly Seal cost */
  hsCost: number;
}

/** Full mandate configuration */
export interface MandateConfig {
  /** All 4 mandate levels */
  levels: MandateLevelConfig[];
  /** DC to HS conversion rate */
  dcPerSeal: number;
}

/** Runtime state for the mandate system */
export interface MandateState {
  /** 12 mandate slots, one per hall */
  slots: MandateSlot[];
}
