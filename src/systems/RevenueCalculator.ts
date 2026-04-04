/**
 * RevenueCalculator — Master revenue formula for all cultivation halls.
 *
 * Revenue/cycle = BaseRevenue x UnitsOwned x MilestoneMult x HDP_Mult x DaoPathMult
 *                 x MandateMult x AlchemyMult x DiscipleBonus x LegacyMult x GlobalMults
 *
 * All math uses break_infinity.js Decimal for arbitrary-precision arithmetic.
 */
import Decimal from 'break_infinity.js';
import { D } from '@core/BigNumber';
import type { GameStateSnapshot, HallState, HallConfig } from './types';

/** Individual multiplier breakdown for debugging / UI display */
export interface RevenueBreakdown {
  hallId: number;
  baseRevenue: Decimal;
  unitsOwned: number;
  milestoneProfitMult: Decimal;
  hdpMult: Decimal;
  daoPathMult: Decimal;
  mandateMult: Decimal;
  alchemyMult: Decimal;
  discipleBonus: Decimal;
  legacyMult: Decimal;
  globalMults: Decimal;
  spellMult: Decimal;
  challengeRewardMult: Decimal;
  totalPerCycle: Decimal;
  cycleSeconds: number;
  effectiveCycleSeconds: number;
  perSecond: Decimal;
}

// --- Multiplier extraction helpers ---

function getHDPMultiplier(state: GameStateSnapshot): Decimal {
  const hdp = state.currencies.hdp;
  const spent = state.hdpSpent;
  return D(1 + (hdp - spent) * 0.02);
}

function getDaoPathMultiplier(hallId: number, state: GameStateSnapshot): Decimal {
  const selectedId = state.daoPath.selectedPathId;
  if (selectedId === null) return D(1);

  const pathConfig = state.daoPathConfigs.find(p => p.id === selectedId);
  if (!pathConfig) return D(1);

  if (pathConfig.boostedHallIds.includes(hallId)) {
    return D(pathConfig.hallMultiplier);
  }
  return D(1);
}

function getMandateMultiplier(hallId: number, state: GameStateSnapshot): Decimal {
  const LEVEL_MULTS = [1, 1.5, 3, 6, 15];
  const slot = state.mandates.find(m => m.hallId === hallId);
  if (!slot || slot.level <= 0) return D(1);
  const idx = Math.min(slot.level, 4);
  return D(LEVEL_MULTS[idx]);
}

function getAlchemyMultiplier(hallId: number, state: GameStateSnapshot): Decimal {
  let mult = D(1);
  for (const buff of state.alchemy.activeBuffs) {
    if (buff.remainingSeconds > 0) {
      if (buff.affectedHallIds.length === 0 || buff.affectedHallIds.includes(hallId)) {
        mult = mult.mul(buff.multiplier);
      }
    }
  }
  return mult;
}

function getDiscipleBonus(hallId: number, state: GameStateSnapshot): Decimal {
  const hallState = state.halls.find(h => h.hallId === hallId);
  if (!hallState?.assignedDiscipleId) return D(1);

  const disciple = state.disciples.find(d => d.instanceId === hallState.assignedDiscipleId);
  if (!disciple || !disciple.alive) return D(1);

  const config = state.discipleConfigs.find(c => c.id === disciple.configId);
  if (!config) return D(1);

  // Rarity multiplier
  const RARITY_MULTS: Record<string, number> = {
    common: 1.05,
    uncommon: 1.12,
    rare: 1.25,
    epic: 1.50,
    legendary: 2.00,
  };
  let bonus = RARITY_MULTS[config.rarity] ?? 1;

  // Element match check
  const hallConfig = state.hallConfigs.find(h => h.id === hallId);
  if (hallConfig && hallConfig.element !== 'neutral' && config.root === hallConfig.element) {
    bonus *= 2.0;
  }

  // Trait match: simplified — check if hallPassive mentions the hall's name
  // TODO: Implement proper trait matching when trait configs are available
  // For now, trait match is always x1 unless explicitly handled
  // Max possible: 2.00 * 2.00 * 1.25 = 5.00

  bonus = Math.min(bonus, 5.0);
  return D(bonus);
}

function getLegacyMultiplier(state: GameStateSnapshot): Decimal {
  const lp = state.legacy.legacyPower;
  if (lp <= 0) return D(1);
  // 1 + log10(1 + legacyPower) * 0.5
  return D(1 + Math.log10(1 + lp) * 0.5);
}

function getSpellMultiplier(hallId: number, state: GameStateSnapshot): Decimal {
  const spellState = state.spellState;
  let mult = spellState.globalMultiplier;
  const hallMult = spellState.hallMultipliers[hallId];
  if (hallMult !== undefined) {
    mult *= hallMult;
  }
  return D(mult);
}

function getChallengeRewardMultiplier(hallId: number, state: GameStateSnapshot): Decimal {
  let mult = D(1);
  for (const cs of state.challenges) {
    if (!cs.completed) continue;
    const config = state.challengeConfigs.find(c => c.id === cs.challengeId);
    if (!config) continue;

    switch (config.rewardType) {
      case 'allIncomeMult':
      case 'allSpeedMult':
        mult = mult.mul(config.rewardValue);
        break;
      case 'hallProfitMult':
        // Only apply to the target hall, or all halls if no target specified
        if (!config.targetHallId || config.targetHallId === hallId) {
          mult = mult.mul(config.rewardValue);
        }
        break;
      default:
        // Other reward types handled by their respective systems
        break;
    }
  }
  return mult;
}

function getEffectiveCycleSeconds(
  hallConfig: HallConfig,
  hallState: HallState,
  state: GameStateSnapshot,
): number {
  let cycle = hallConfig.cycleSeconds;

  // Milestone speed multiplier
  if (hallState.milestoneSpeedMult > 0) {
    cycle /= hallState.milestoneSpeedMult;
  }

  // Elder speed bonus (2x when hired)
  if (hallState.assignedElderId !== null) {
    const elder = state.elders.find(e => e.elderId === hallState.assignedElderId);
    if (elder?.hired) {
      cycle /= 2;
    }
  }

  return Math.max(cycle, 0.01); // Floor to prevent division by zero
}

// --- Public API ---

/**
 * Compute full revenue for one hall per cycle.
 */
export function calculateRevenue(hallId: number, state: GameStateSnapshot): Decimal {
  const hallConfig = state.hallConfigs.find(h => h.id === hallId);
  const hallState = state.halls.find(h => h.hallId === hallId);

  if (!hallConfig || !hallState || hallState.level <= 0 || !hallState.unlocked) {
    return D(0);
  }

  return hallConfig.baseRevenue
    .mul(hallState.level)
    .mul(hallState.milestoneProfitMult > 0 ? hallState.milestoneProfitMult : 1)
    .mul(getHDPMultiplier(state))
    .mul(getDaoPathMultiplier(hallId, state))
    .mul(getMandateMultiplier(hallId, state))
    .mul(getAlchemyMultiplier(hallId, state))
    .mul(getDiscipleBonus(hallId, state))
    .mul(getLegacyMultiplier(state))
    .mul(getSpellMultiplier(hallId, state))
    .mul(getChallengeRewardMultiplier(hallId, state));
}

/**
 * Revenue per second for one hall (revenue / effective cycle time).
 */
export function calculateRevenuePerSecond(hallId: number, state: GameStateSnapshot): Decimal {
  const hallConfig = state.hallConfigs.find(h => h.id === hallId);
  const hallState = state.halls.find(h => h.hallId === hallId);

  if (!hallConfig || !hallState || hallState.level <= 0 || !hallState.unlocked) {
    return D(0);
  }

  const revenue = calculateRevenue(hallId, state);
  const effectiveCycle = getEffectiveCycleSeconds(hallConfig, hallState, state);

  return revenue.div(effectiveCycle);
}

/**
 * Sum of revenue per second across all halls.
 */
export function calculateTotalRevenuePerSecond(state: GameStateSnapshot): Decimal {
  let total = D(0);
  for (const hall of state.halls) {
    if (hall.unlocked && hall.level > 0) {
      total = total.add(calculateRevenuePerSecond(hall.hallId, state));
    }
  }
  return total;
}

/**
 * Full breakdown for UI display and debugging.
 */
export function getRevenueBreakdown(hallId: number, state: GameStateSnapshot): RevenueBreakdown | null {
  const hallConfig = state.hallConfigs.find(h => h.id === hallId);
  const hallState = state.halls.find(h => h.hallId === hallId);

  if (!hallConfig || !hallState) return null;

  const effectiveCycle = getEffectiveCycleSeconds(hallConfig, hallState, state);
  const totalPerCycle = calculateRevenue(hallId, state);

  return {
    hallId,
    baseRevenue: hallConfig.baseRevenue,
    unitsOwned: hallState.level,
    milestoneProfitMult: D(hallState.milestoneProfitMult > 0 ? hallState.milestoneProfitMult : 1),
    hdpMult: getHDPMultiplier(state),
    daoPathMult: getDaoPathMultiplier(hallId, state),
    mandateMult: getMandateMultiplier(hallId, state),
    alchemyMult: getAlchemyMultiplier(hallId, state),
    discipleBonus: getDiscipleBonus(hallId, state),
    legacyMult: getLegacyMultiplier(state),
    globalMults: D(1),
    spellMult: getSpellMultiplier(hallId, state),
    challengeRewardMult: getChallengeRewardMultiplier(hallId, state),
    totalPerCycle,
    cycleSeconds: hallConfig.cycleSeconds,
    effectiveCycleSeconds: effectiveCycle,
    perSecond: hallState.level > 0 ? totalPerCycle.div(effectiveCycle) : D(0),
  };
}
