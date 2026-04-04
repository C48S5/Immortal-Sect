/**
 * AutomationSystem — Progressive autobuyers unlocked by HDP thresholds.
 *
 * 10 tiers:
 *   50 HDP:    Auto-buy Hall 1
 *   150 HDP:   Auto-buy Halls 1-3
 *   500 HDP:   Auto-buy Halls 1-6
 *   1500 HDP:  Auto-buy ALL halls
 *   3000 HDP:  Auto-hire Elders 1-6
 *   7500 HDP:  Auto-hire ALL Elders
 *   10000 HDP: Auto-craft pills 1-3
 *   15000 HDP: All pills + auto-assign disciples
 *   25000 HDP: Auto-challenge
 *   50000 HDP: Listed but NEVER implemented (auto-Ascend is manual only per GDD)
 *
 * Auto-buy: buy x1 of each qualifying hall per tick if affordable.
 * Auto-hire: hire elders if affordable and not yet hired.
 */
import Decimal from 'break_infinity.js';
import { bulkCost } from '@core/BigNumber';
import type { GameStateSnapshot } from './types';

/** Automation tier definition */
export interface AutoTier {
  id: number;
  hdpThreshold: number;
  description: string;
  type: 'autoBuyHalls' | 'autoHireElders' | 'autoCraft' | 'autoAssignDisciples' | 'autoChallenge' | 'disabled';
  hallRange?: [number, number]; // inclusive [min, max] hallId
  elderRange?: [number, number];
  pillRange?: [number, number];
}

const AUTOMATION_TIERS: AutoTier[] = [
  { id: 1, hdpThreshold: 50, description: 'Auto-buy Hall 1', type: 'autoBuyHalls', hallRange: [1, 1] },
  { id: 2, hdpThreshold: 150, description: 'Auto-buy Halls 1-3', type: 'autoBuyHalls', hallRange: [1, 3] },
  { id: 3, hdpThreshold: 500, description: 'Auto-buy Halls 1-6', type: 'autoBuyHalls', hallRange: [1, 6] },
  { id: 4, hdpThreshold: 1500, description: 'Auto-buy ALL halls', type: 'autoBuyHalls', hallRange: [1, 12] },
  { id: 5, hdpThreshold: 3000, description: 'Auto-hire Elders 1-6', type: 'autoHireElders', elderRange: [1, 6] },
  { id: 6, hdpThreshold: 7500, description: 'Auto-hire ALL Elders', type: 'autoHireElders', elderRange: [1, 12] },
  { id: 7, hdpThreshold: 10000, description: 'Auto-craft pills 1-3', type: 'autoCraft', pillRange: [1, 3] },
  { id: 8, hdpThreshold: 15000, description: 'All pills + auto-assign disciples', type: 'autoCraft', pillRange: [1, 10] },
  { id: 9, hdpThreshold: 25000, description: 'Auto-challenge', type: 'autoChallenge' },
  { id: 10, hdpThreshold: 50000, description: 'Auto-Ascend (DISABLED per GDD)', type: 'disabled' },
];

/** Get all automation tier configs. */
export function getAutomationTiers(): AutoTier[] {
  return AUTOMATION_TIERS;
}

/** Check which tiers are unlocked at the given HDP level. */
export function getUnlockedTiers(hdp: number): AutoTier[] {
  return AUTOMATION_TIERS.filter(t => hdp >= t.hdpThreshold && t.type !== 'disabled');
}

/** Check if a specific tier is unlocked. */
export function isTierUnlocked(tierId: number, hdp: number): boolean {
  const tier = AUTOMATION_TIERS.find(t => t.id === tierId);
  if (!tier) return false;
  return hdp >= tier.hdpThreshold && tier.type !== 'disabled';
}

/** Action to buy a hall level. Store applies this. */
export interface AutoBuyAction {
  type: 'buyHall';
  hallId: number;
  cost: Decimal;
}

/** Action to hire an elder. */
export interface AutoHireAction {
  type: 'hireElder';
  elderId: number;
  cost: Decimal;
}

/** Action to craft a pill. */
export interface AutoCraftAction {
  type: 'craftPill';
  pillId: number;
  aeCost: number;
}

export type AutomationAction = AutoBuyAction | AutoHireAction | AutoCraftAction;

/**
 * Compute the highest hall range that should be auto-bought.
 * Higher tiers supersede lower ones for the same type.
 */
function getAutoBuyRange(hdp: number): [number, number] | null {
  let best: [number, number] | null = null;

  for (const tier of AUTOMATION_TIERS) {
    if (hdp < tier.hdpThreshold) continue;
    if (tier.type === 'autoBuyHalls' && tier.hallRange) {
      if (!best || tier.hallRange[1] > best[1]) {
        best = tier.hallRange;
      }
    }
  }

  return best;
}

/**
 * Compute the highest elder range for auto-hiring.
 */
function getAutoHireRange(hdp: number): [number, number] | null {
  let best: [number, number] | null = null;

  for (const tier of AUTOMATION_TIERS) {
    if (hdp < tier.hdpThreshold) continue;
    if (tier.type === 'autoHireElders' && tier.elderRange) {
      if (!best || tier.elderRange[1] > best[1]) {
        best = tier.elderRange;
      }
    }
  }

  return best;
}

/**
 * Compute the pill range for auto-crafting.
 */
function getAutoCraftRange(hdp: number): [number, number] | null {
  let best: [number, number] | null = null;

  for (const tier of AUTOMATION_TIERS) {
    if (hdp < tier.hdpThreshold) continue;
    if (tier.type === 'autoCraft' && tier.pillRange) {
      if (!best || tier.pillRange[1] > best[1]) {
        best = tier.pillRange;
      }
    }
  }

  return best;
}

/**
 * Main automation tick. Examines the game state and returns a list of actions
 * that the store should apply. Pure function, no side effects.
 *
 * Auto-buy: buy x1 of each qualifying hall per tick if affordable.
 * Auto-hire: hire elders if affordable and not yet hired.
 * Auto-craft: craft pills if AE is sufficient and no duplicate buff active.
 */
export function tickAutomation(state: GameStateSnapshot): AutomationAction[] {
  const actions: AutomationAction[] = [];
  const hdp = state.currencies.hdp;
  let budget = state.currencies.spiritStones;

  // --- Auto-buy halls ---
  const buyRange = getAutoBuyRange(hdp);
  if (buyRange) {
    for (let hallId = buyRange[0]; hallId <= buyRange[1]; hallId++) {
      const hallState = state.halls.find(h => h.hallId === hallId);
      const hallConfig = state.hallConfigs.find(h => h.id === hallId);

      if (!hallState || !hallConfig || !hallState.unlocked) continue;

      const cost = bulkCost(hallConfig.baseCost, hallConfig.coefficient, hallState.level, 1);
      if (budget.gte(cost)) {
        actions.push({ type: 'buyHall', hallId, cost });
        budget = budget.sub(cost);
      }
    }
  }

  // --- Auto-hire elders ---
  const hireRange = getAutoHireRange(hdp);
  if (hireRange) {
    for (let elderId = hireRange[0]; elderId <= hireRange[1]; elderId++) {
      const elderState = state.elders.find(e => e.elderId === elderId);
      const elderConfig = state.elderConfigs.find(e => e.id === elderId);

      if (!elderState || !elderConfig || elderState.hired) continue;

      if (budget.gte(elderConfig.cost)) {
        actions.push({ type: 'hireElder', elderId, cost: elderConfig.cost });
        budget = budget.sub(elderConfig.cost);
      }
    }
  }

  // --- Auto-craft pills ---
  const craftRange = getAutoCraftRange(hdp);
  if (craftRange) {
    let aeBalance = state.alchemy.alchemyEssence;
    const activeItemIds = new Set(
      state.alchemy.activeBuffs
        .filter(b => b.remainingSeconds > 0)
        .map(b => b.itemId),
    );

    for (let pillId = craftRange[0]; pillId <= craftRange[1]; pillId++) {
      // Skip if this buff is already active
      if (activeItemIds.has(pillId)) continue;

      const config = state.alchemyConfigs.find(c => c.id === pillId);
      if (!config) continue;

      // Check unlock level (Hall 3 level)
      const hall3 = state.halls.find(h => h.hallId === 3);
      if (!hall3 || hall3.level < config.unlockLevel) continue;

      if (aeBalance.gte(config.aeCost)) {
        actions.push({ type: 'craftPill', pillId, aeCost: config.aeCost });
        aeBalance = aeBalance.sub(config.aeCost);
      }
    }
  }

  return actions;
}

/**
 * Check if auto-assign disciples is unlocked (15000 HDP tier).
 */
export function isAutoAssignUnlocked(hdp: number): boolean {
  return hdp >= 15000;
}

/**
 * Check if auto-challenge is unlocked (25000 HDP tier).
 */
export function isAutoChallengeUnlocked(hdp: number): boolean {
  return hdp >= 25000;
}
