/**
 * LegacySystem — Permadeath resolution and Qi Residue shop.
 *
 * When disciples die:
 *   Common death  = 1 QR
 *   Uncommon death = 3 QR
 *   Rare death    = +1% hall income permanent (Minor Fragment, 1 LP)
 *   Epic death    = chosen trait at 50% power permanent (Major Fragment, 10 LP)
 *   Legendary death = trait at 100% + Legacy Technique (Mythic Fragment, 50 LP)
 *
 * Legacy Power multiplier: 1 + log10(1 + legacyPower) * 0.5
 *
 * Qi Residue Shop: 8 buffs with increasing costs, max purchases each.
 */
import { Rarity } from '@models/disciple';
import type { DiscipleConfig } from '@models/disciple';
import type {
  LegacyState,
  LegacyFragment,
  LegacyResult,
  QiResidueBuffConfig,
} from './types';

// --- Qi Residue on death per rarity ---

const QR_ON_DEATH: Record<string, number> = {
  [Rarity.Common]: 1,
  [Rarity.Uncommon]: 3,
  [Rarity.Rare]: 5,
  [Rarity.Epic]: 15,
  [Rarity.Legendary]: 50,
};

// --- Legacy Power per fragment type ---

const LP_PER_FRAGMENT: Record<string, number> = {
  minor: 1,
  major: 10,
  mythic: 50,
};

// --- Qi Residue Shop Buffs ---

const QI_RESIDUE_BUFFS: QiResidueBuffConfig[] = [
  {
    id: 1, name: 'Spirit Stone Attractor',
    description: 'All income +5% per purchase',
    cost: 50, maxPurchases: 10,
    effect: { type: 'allIncome', value: 0.05 },
  },
  {
    id: 2, name: 'Essence Amplifier',
    description: 'AE generation +10% per purchase',
    cost: 100, maxPurchases: 5,
    effect: { type: 'aeGeneration', value: 0.10 },
  },
  {
    id: 3, name: 'Swift Cultivation',
    description: 'All cycle speeds +5% per purchase',
    cost: 200, maxPurchases: 8,
    effect: { type: 'cycleSpeed', value: 0.05 },
  },
  {
    id: 4, name: 'Disciple Talent',
    description: 'Disciple bonus +10% per purchase',
    cost: 500, maxPurchases: 5,
    effect: { type: 'discipleBonus', value: 0.10 },
  },
  {
    id: 5, name: 'Realm Walker',
    description: 'Idle farming rate +15% per purchase',
    cost: 1000, maxPurchases: 5,
    effect: { type: 'idleFarming', value: 0.15 },
  },
  {
    id: 6, name: 'Fortune\'s Favor',
    description: 'Treasure value +20% per purchase',
    cost: 2500, maxPurchases: 3,
    effect: { type: 'treasureValue', value: 0.20 },
  },
  {
    id: 7, name: 'Heavenly Insight',
    description: 'HDP gain +5% per purchase',
    cost: 5000, maxPurchases: 3,
    effect: { type: 'hdpGain', value: 0.05 },
  },
  {
    id: 8, name: 'Dao Resonance',
    description: 'All multipliers +2% per purchase',
    cost: 10000, maxPurchases: 5,
    effect: { type: 'globalMult', value: 0.02 },
  },
];

/**
 * Get all Qi Residue buff configs.
 */
export function getQiResidueBuffConfigs(): QiResidueBuffConfig[] {
  return QI_RESIDUE_BUFFS;
}

/**
 * Process a disciple's death. Returns the legacy result.
 */
export function processDiscipleDeath(
  discipleConfig: DiscipleConfig,
  _legacyState: LegacyState,
): LegacyResult {
  const qiResidue = QR_ON_DEATH[discipleConfig.rarity] ?? 1;
  let fragment: LegacyFragment | null = null;
  let legacyPowerGained = 0;
  let message = `${discipleConfig.name} has fallen.`;

  switch (discipleConfig.rarity) {
    case Rarity.Common:
    case Rarity.Uncommon:
      message += ` Gained ${qiResidue} Qi Residue.`;
      break;

    case Rarity.Rare:
      fragment = {
        discipleConfigId: discipleConfig.id,
        type: 'minor',
        legacyPower: LP_PER_FRAGMENT.minor,
      };
      legacyPowerGained = LP_PER_FRAGMENT.minor;
      message += ` Minor Fragment obtained (+1% hall income). Gained ${qiResidue} QR and ${legacyPowerGained} LP.`;
      break;

    case Rarity.Epic:
      fragment = {
        discipleConfigId: discipleConfig.id,
        type: 'major',
        legacyPower: LP_PER_FRAGMENT.major,
        traitName: discipleConfig.hallPassive.description,
        traitPower: 0.5, // 50% power
      };
      legacyPowerGained = LP_PER_FRAGMENT.major;
      message += ` Major Fragment obtained (trait at 50% power). Gained ${qiResidue} QR and ${legacyPowerGained} LP.`;
      break;

    case Rarity.Legendary:
      fragment = {
        discipleConfigId: discipleConfig.id,
        type: 'mythic',
        legacyPower: LP_PER_FRAGMENT.mythic,
        traitName: discipleConfig.hallPassive.description,
        traitPower: 1.0, // 100% power
      };
      legacyPowerGained = LP_PER_FRAGMENT.mythic;
      message += ` Mythic Fragment obtained (trait at 100% + Legacy Technique)! Gained ${qiResidue} QR and ${legacyPowerGained} LP.`;
      break;
  }

  return {
    qiResidue,
    fragment,
    legacyPowerGained,
    message,
  };
}

/**
 * Calculate the Legacy Power multiplier.
 * Formula: 1 + log10(1 + legacyPower) * 0.5
 */
export function getLegacyMultiplier(legacyPower: number): number {
  if (legacyPower <= 0) return 1;
  return 1 + Math.log10(1 + legacyPower) * 0.5;
}

/**
 * Attempt to purchase a Qi Residue buff.
 */
export function purchaseQiResidueBuff(
  buffId: number,
  legacyState: LegacyState,
  qiResidue: number,
): {
  success: boolean;
  cost: number;
  updatedPurchases: Record<number, number>;
  message: string;
} {
  const buff = QI_RESIDUE_BUFFS.find(b => b.id === buffId);
  if (!buff) {
    return {
      success: false,
      cost: 0,
      updatedPurchases: legacyState.qiResidueBuffsPurchased,
      message: 'Buff not found.',
    };
  }

  const currentCount = legacyState.qiResidueBuffsPurchased[buffId] ?? 0;
  if (currentCount >= buff.maxPurchases) {
    return {
      success: false,
      cost: buff.cost,
      updatedPurchases: legacyState.qiResidueBuffsPurchased,
      message: `${buff.name} is already at max purchases (${buff.maxPurchases}).`,
    };
  }

  // Cost scales with purchase count: cost * (1 + 0.5 * currentCount)
  const scaledCost = Math.ceil(buff.cost * (1 + 0.5 * currentCount));

  if (qiResidue < scaledCost) {
    return {
      success: false,
      cost: scaledCost,
      updatedPurchases: legacyState.qiResidueBuffsPurchased,
      message: `Need ${scaledCost} Qi Residue (have ${qiResidue}).`,
    };
  }

  const updatedPurchases = {
    ...legacyState.qiResidueBuffsPurchased,
    [buffId]: currentCount + 1,
  };

  return {
    success: true,
    cost: scaledCost,
    updatedPurchases,
    message: `Purchased ${buff.name} (${currentCount + 1}/${buff.maxPurchases}).`,
  };
}

/**
 * Get the total bonus from all purchased QR buffs of a specific type.
 */
export function getQiResidueBuffTotal(
  effectType: string,
  purchases: Record<number, number>,
): number {
  let total = 0;

  for (const buff of QI_RESIDUE_BUFFS) {
    if (buff.effect.type !== effectType) continue;
    const count = purchases[buff.id] ?? 0;
    total += buff.effect.value * count;
  }

  return total;
}

/**
 * Get the accumulated permanent hall income bonus from Minor Fragments.
 * Each Minor Fragment grants +1% (0.01) hall income.
 */
export function getFragmentIncomeBonus(fragments: LegacyFragment[]): number {
  let bonus = 0;

  for (const frag of fragments) {
    if (frag.type === 'minor') {
      bonus += 0.01;
    }
  }

  return bonus;
}

/**
 * Initialize default legacy state.
 */
export function createDefaultLegacyState(): LegacyState {
  return {
    legacyPower: 0,
    fragments: [],
    qiResidueBuffsPurchased: {},
  };
}

/**
 * Get a summary of all QR buff purchases for the UI.
 */
export function getQiResidueShopSummary(
  purchases: Record<number, number>,
  qiResidue: number,
): {
  id: number;
  name: string;
  description: string;
  purchased: number;
  maxPurchases: number;
  nextCost: number | null;
  canAfford: boolean;
}[] {
  return QI_RESIDUE_BUFFS.map(buff => {
    const purchased = purchases[buff.id] ?? 0;
    const atMax = purchased >= buff.maxPurchases;
    const nextCost = atMax ? null : Math.ceil(buff.cost * (1 + 0.5 * purchased));

    return {
      id: buff.id,
      name: buff.name,
      description: buff.description,
      purchased,
      maxPurchases: buff.maxPurchases,
      nextCost,
      canAfford: nextCost !== null && qiResidue >= nextCost,
    };
  });
}
