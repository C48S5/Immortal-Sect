/**
 * LegacySystem — Permadeath resolution.
 *
 * When disciples die:
 *   Common death  = 1 QR
 *   Uncommon death = 3 QR
 *   Rare death    = +1% hall income permanent (Minor Fragment, 1 LP)
 *   Epic death    = chosen trait at 50% power permanent (Major Fragment, 10 LP)
 *   Legendary death = trait at 100% + Legacy Technique (Mythic Fragment, 50 LP)
 *
 * Qi Residue Shop configs live in src/data/qiResidueShopConfigs.ts
 * Legacy Power multiplier lives in RevenueCalculator.ts
 */
import { Rarity } from '@models/disciple';
import type { DiscipleConfig } from '@models/disciple';
import type {
  LegacyState,
  LegacyFragment,
  LegacyResult,
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

