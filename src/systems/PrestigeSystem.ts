/**
 * PrestigeSystem — Ascension / Heavenly Dao Points (HDP).
 *
 * HDP gain = floor(sqrt(totalEarnings / 44,440,000,000))
 * HDP multiplier = 1 + (hdp - spent) * 0.02
 *
 * Ascension resets: Spirit Stones, Alchemy Essence, hall levels, elder hires,
 *   cycle progress, alchemy buffs, disciple assignments.
 * Persists: HDP, Dao Crystals, Heavenly Seals, automation unlocks,
 *   HDP shop purchases, challenge rewards, Legacy, Recruitment Tokens, Qi Residue.
 */
import Decimal from 'break_infinity.js';
import { D } from '@core/BigNumber';
import type { GameStateSnapshot, ResetResult } from './types';

/** The divisor used in the HDP gain formula (44.44 billion) */
const HDP_DIVISOR = new Decimal('44440000000');

/** Minimum total earnings to gain any HDP */
const MIN_EARNINGS_FOR_HDP = HDP_DIVISOR;

/**
 * Calculate how many HDP would be gained from an Ascension.
 * Formula: floor(sqrt(totalEarnings / 44.44B))
 */
export function calculateHDPGain(totalRevenue: Decimal): number {
  if (totalRevenue.lt(MIN_EARNINGS_FOR_HDP)) {
    return 0;
  }

  const ratio = totalRevenue.div(HDP_DIVISOR);
  // sqrt via Decimal, then floor
  const sqrtVal = ratio.pow(0.5);
  return Math.floor(sqrtVal.toNumber());
}

/**
 * Calculate the HDP multiplier applied to all revenue.
 * Formula: 1 + (hdp - spent) * 0.02
 * "spent" refers to HDP used in the HDP shop; they still count for the multiplier
 * but are tracked separately. The multiplier uses unspent HDP.
 */
export function getHDPMultiplier(hdp: number, spent: number): number {
  const unspent = Math.max(hdp - spent, 0);
  return 1 + unspent * 0.02;
}

/**
 * Preview the HDP gain before performing the Ascension.
 * Useful for the UI "Ascend" button tooltip.
 */
export function previewAscension(state: GameStateSnapshot): {
  hdpGain: number;
  newTotal: number;
  newMultiplier: number;
  worthIt: boolean;
} {
  const gain = calculateHDPGain(state.totalEarnings);
  const newTotal = state.currencies.hdp + gain;
  const newMult = getHDPMultiplier(newTotal, state.hdpSpent);
  return {
    hdpGain: gain,
    newTotal,
    newMultiplier: newMult,
    worthIt: gain > 0,
  };
}

/**
 * Perform the Ascension: compute what gets reset and what gets kept.
 * This is a pure function that returns the result — the store applies it.
 */
export function performAscension(state: GameStateSnapshot): ResetResult {
  const hdpGained = calculateHDPGain(state.totalEarnings);

  if (hdpGained <= 0) {
    return {
      hdpGained: 0,
      totalHdp: state.currencies.hdp,
      resetFields: [],
      preservedFields: [],
    };
  }

  const totalHdp = state.currencies.hdp + hdpGained;

  // Disciples die on Ascension — they are reset, not preserved.
  // TODO: When discipleStore is created, iterate all living disciples here,
  // call LegacySystem.processDiscipleDeath for each, then clear the roster.
  // Legacy rewards (QR, LP, fragments) are granted before the reset.
  const resetFields = [
    'spiritStones',
    'alchemyEssence',
    'hallLevels',
    'elderHires',
    'cycleProgress',
    'alchemyBuffs',
    'discipleAssignments',
    'hallRunningState',
    'disciples',       // Disciples die on Ascension (permadeath)
  ];

  const preservedFields = [
    'hdp',
    'daoCrystals',
    'heavenlySeals',
    'automationUnlocks',
    'hdpShopPurchases',
    'challengeRewards',
    'completedChallenges',
    'legacyPower',
    'legacyFragments',
    'recruitmentTokens',
    'qiResidue',
    'dungeonProgress',
    'mandateSlots',
    'selectedDaoPath',
    'totalPulls',
  ];

  return {
    hdpGained,
    totalHdp,
    resetFields,
    preservedFields,
  };
}

/**
 * Generate the default reset values for fields that get wiped on Ascension.
 * Stores can use this to know exactly what to set.
 */
export function getAscensionResetValues(): {
  spiritStones: Decimal;
  alchemyEssence: Decimal;
  hallLevel: number;
  elderHired: boolean;
  cycleProgress: number;
  isRunning: boolean;
  activeBuffs: never[];
  assignedDiscipleId: null;
  assignedElderId: null;
} {
  return {
    spiritStones: D(0),
    alchemyEssence: D(0),
    hallLevel: 0,
    elderHired: false,
    cycleProgress: 0,
    isRunning: false,
    activeBuffs: [],
    assignedDiscipleId: null,
    assignedElderId: null,
  };
}
