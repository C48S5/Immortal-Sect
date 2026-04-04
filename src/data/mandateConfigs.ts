import type { MandateConfig } from '../models/mandate';

/**
 * Heavenly Mandate configuration.
 * 4 levels per hall slot (12 halls x 4 levels = 48 total slots).
 * Dao Comprehension Throne (Hall 12) SPECIAL milestones increase effectiveness.
 */
export const MANDATE_CONFIG: MandateConfig = {
  levels: [
    { level: 1, multiplier: 1.5, hsCost: 1 },
    { level: 2, multiplier: 3, hsCost: 3 },
    { level: 3, multiplier: 6, hsCost: 10 },
    { level: 4, multiplier: 15, hsCost: 25 },
  ],
  /** 6 Dao Crystals = 1 Heavenly Seal */
  dcPerSeal: 6,
};
