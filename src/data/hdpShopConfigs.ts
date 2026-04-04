/** Configuration for a single HDP shop upgrade */
export interface HdpShopUpgradeConfig {
  /** Unique upgrade identifier (1-10) */
  id: number;
  /** Display name */
  name: string;
  /** HDP cost to purchase */
  hdpCost: number;
  /** Effect description */
  effectDescription: string;
  /** Hall IDs affected (empty = all halls) */
  affectedHallIds: number[];
  /** Income multiplier granted (permanent) */
  multiplier: number;
}

/** All 10 HDP Shop upgrade configurations */
export const HDP_SHOP_CONFIGS: readonly HdpShopUpgradeConfig[] = [
  {
    id: 1,
    name: 'Qi Burst',
    hdpCost: 10,
    effectDescription: 'x2 Hall 1 income permanent',
    affectedHallIds: [1],
    multiplier: 2,
  },
  {
    id: 2,
    name: 'Iron Body',
    hdpCost: 25,
    effectDescription: 'x2 Hall 2 income permanent',
    affectedHallIds: [2],
    multiplier: 2,
  },
  {
    id: 3,
    name: 'Furnace Mastery',
    hdpCost: 50,
    effectDescription: 'x2 Hall 3 income permanent',
    affectedHallIds: [3],
    multiplier: 2,
  },
  {
    id: 4,
    name: 'Formation Insight',
    hdpCost: 100,
    effectDescription: 'x2 Hall 4 income permanent',
    affectedHallIds: [4],
    multiplier: 2,
  },
  {
    id: 5,
    name: 'Beast Communion',
    hdpCost: 200,
    effectDescription: 'x2 Hall 5 income permanent',
    affectedHallIds: [5],
    multiplier: 2,
  },
  {
    id: 6,
    name: 'Talisman Wisdom',
    hdpCost: 400,
    effectDescription: 'x2 Hall 6 income permanent',
    affectedHallIds: [6],
    multiplier: 2,
  },
  {
    id: 7,
    name: 'Sword Heart',
    hdpCost: 750,
    effectDescription: 'x2 Hall 7 income permanent',
    affectedHallIds: [7],
    multiplier: 2,
  },
  {
    id: 8,
    name: 'Thunder Dao',
    hdpCost: 1500,
    effectDescription: 'x2 Hall 8 income permanent',
    affectedHallIds: [8],
    multiplier: 2,
  },
  {
    id: 9,
    name: 'Void Mastery',
    hdpCost: 3000,
    effectDescription: 'x2 Hall 9 income permanent',
    affectedHallIds: [9],
    multiplier: 2,
  },
  {
    id: 10,
    name: 'Cosmic Insight',
    hdpCost: 5000,
    effectDescription: 'x2 ALL halls income permanent',
    affectedHallIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    multiplier: 2,
  },
] as const;
