/** Configuration for a Qi Residue shop buff */
export interface QiResidueBuffConfig {
  /** Unique buff identifier */
  id: string;
  /** Display name */
  name: string;
  /** QR cost per purchase */
  cost: number;
  /** Effect description per purchase */
  effectDescription: string;
  /** Bonus value per purchase (as decimal, e.g. 0.005 = +0.5%) */
  valuePerPurchase: number;
  /** Maximum number of purchases */
  maxPurchases: number;
  /** Maximum total bonus (valuePerPurchase * maxPurchases) */
  maxTotalBonus: number;
}

/** All Qi Residue shop buff configurations (Section 6.1 of Disciple System doc) */
export const QI_RESIDUE_SHOP_CONFIGS: readonly QiResidueBuffConfig[] = [
  {
    id: 'qi-condensation',
    name: 'Qi Condensation',
    cost: 50,
    effectDescription: '+0.5% all hall income',
    valuePerPurchase: 0.005,
    maxPurchases: 20,
    maxTotalBonus: 0.10,
  },
  {
    id: 'foundation-strengthening',
    name: 'Foundation Strengthening',
    cost: 150,
    effectDescription: '+1% Ascension HDP gain',
    valuePerPurchase: 0.01,
    maxPurchases: 10,
    maxTotalBonus: 0.10,
  },
  {
    id: 'spirit-sense',
    name: 'Spirit Sense',
    cost: 300,
    effectDescription: '+2% Heavenly Treasure value',
    valuePerPurchase: 0.02,
    maxPurchases: 10,
    maxTotalBonus: 0.20,
  },
  {
    id: 'root-purification',
    name: 'Root Purification',
    cost: 500,
    effectDescription: '+1% disciple base stats',
    valuePerPurchase: 0.01,
    maxPurchases: 20,
    maxTotalBonus: 0.20,
  },
  {
    id: 'karma-accumulation',
    name: 'Karma Accumulation',
    cost: 1000,
    effectDescription: '+0.5% gacha Epic+ rate',
    valuePerPurchase: 0.005,
    maxPurchases: 5,
    maxTotalBonus: 0.025,
  },
  {
    id: 'sect-foundation',
    name: 'Sect Foundation',
    cost: 2500,
    effectDescription: '+3% AE generation',
    valuePerPurchase: 0.03,
    maxPurchases: 10,
    maxTotalBonus: 0.30,
  },
  {
    id: 'heavenly-fortune',
    name: 'Heavenly Fortune',
    cost: 5000,
    effectDescription: '+1 free daily Realm Key',
    valuePerPurchase: 1,
    maxPurchases: 3,
    maxTotalBonus: 3,
  },
  {
    id: 'dao-comprehension',
    name: 'Dao Comprehension',
    cost: 10000,
    effectDescription: '+5% Dao Path spell effectiveness',
    valuePerPurchase: 0.05,
    maxPurchases: 5,
    maxTotalBonus: 0.25,
  },
];

/** Total QR needed to max out all buffs in the shop */
export const TOTAL_QR_TO_MAX_ALL = 148500;
