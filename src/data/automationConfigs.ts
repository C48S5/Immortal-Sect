/** An automation unlock tier */
export interface AutomationUnlockConfig {
  /** HDP threshold to unlock this automation */
  hdpThreshold: number;
  /** Human-readable description of what this unlocks */
  description: string;
  /** Machine-readable automation type */
  automationType: AutomationType;
}

/** Types of automation features */
export type AutomationType =
  | 'autoBuyHall1'
  | 'autoBuyHalls1to3'
  | 'autoBuyHalls1to6'
  | 'autoBuyAllHalls'
  | 'autoHireEldersLow'
  | 'autoHireEldersAll'
  | 'autoCraftBasicPills'
  | 'autoCraftAllPills'
  | 'autoChallenge'
  | 'autoAscend';

/** All automation unlock configurations, ordered by HDP threshold */
export const AUTOMATION_CONFIGS: readonly AutomationUnlockConfig[] = [
  {
    hdpThreshold: 50,
    description: 'Auto-buy Hall 1',
    automationType: 'autoBuyHall1',
  },
  {
    hdpThreshold: 150,
    description: 'Auto-buy Halls 1-3',
    automationType: 'autoBuyHalls1to3',
  },
  {
    hdpThreshold: 500,
    description: 'Auto-buy Halls 1-6',
    automationType: 'autoBuyHalls1to6',
  },
  {
    hdpThreshold: 1500,
    description: 'Auto-buy ALL halls',
    automationType: 'autoBuyAllHalls',
  },
  {
    hdpThreshold: 3000,
    description: 'Auto-hire Elders (Halls 1-6)',
    automationType: 'autoHireEldersLow',
  },
  {
    hdpThreshold: 7500,
    description: 'Auto-hire ALL Elders',
    automationType: 'autoHireEldersAll',
  },
  {
    hdpThreshold: 10000,
    description: 'Auto-craft basic pills (items 1-3)',
    automationType: 'autoCraftBasicPills',
  },
  {
    hdpThreshold: 15000,
    description: 'Auto-craft ALL pills + auto-assign disciples',
    automationType: 'autoCraftAllPills',
  },
  {
    hdpThreshold: 25000,
    description: 'Auto-challenge (repeat completed challenges)',
    automationType: 'autoChallenge',
  },
  {
    hdpThreshold: 50000,
    description: 'Auto-Ascend at optimal HDP (display only, NEVER auto-triggers)',
    automationType: 'autoAscend',
  },
] as const;
