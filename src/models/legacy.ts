import { Rarity } from './disciple';

/** Types of legacy fragments left behind by dying disciples */
export type FragmentType = 'minor' | 'major' | 'mythic';

/** A legacy fragment left by a fallen disciple */
export interface LegacyFragment {
  /** Unique fragment ID */
  id: string;
  /** Name of the fallen disciple who left this fragment */
  discipleName: string;
  /** Rarity of the fallen disciple */
  discipleRarity: Rarity;
  /** Fragment type (Rare=minor, Epic=major, Legendary=mythic) */
  fragmentType: FragmentType;
  /** Legacy Power value this fragment contributes */
  legacyPowerValue: number;
  /** The permanent effect this fragment provides */
  effectDescription: string;
  /** Hall ID this fragment boosts (null if sect-wide) */
  targetHallId: number | null;
  /** Multiplier or percentage bonus applied */
  bonusValue: number;
}

/** A legacy technique from a Legendary disciple (equippable by future disciples) */
export interface LegacyTechnique {
  /** Unique technique ID */
  id: string;
  /** Name of the technique (from the Legendary's combat ability) */
  name: string;
  /** Source disciple name */
  sourceDiscipleName: string;
  /** Effect description */
  effectDescription: string;
  /** Whether currently equipped by a disciple */
  equippedByDiscipleId: string | null;
}

/** A permanent buff purchased from the Qi Residue shop */
export interface QiResidueBuff {
  /** Buff identifier */
  id: string;
  /** Display name */
  name: string;
  /** QR cost per purchase */
  cost: number;
  /** Effect description per stack */
  effectDescription: string;
  /** Bonus value per purchase (percentage as decimal, e.g. 0.005 = +0.5%) */
  valuePerPurchase: number;
  /** Maximum number of purchases */
  maxPurchases: number;
  /** Current number of purchases */
  currentPurchases: number;
}

/** The Legacy Shrine memorial display */
export interface LegacyShrine {
  /** All legacy fragments collected */
  fragments: LegacyFragment[];
  /** All legacy techniques available */
  techniques: LegacyTechnique[];
  /** Total accumulated Legacy Power */
  totalLegacyPower: number;
  /** Current global legacy multiplier: 1 + log10(1 + LP) * 0.5 */
  globalMultiplier: number;
}
