import { create } from 'zustand';
import Decimal from 'break_infinity.js';
import { D } from '../core/BigNumber';
import { useGameStore } from './gameStore';
import { useHallStore } from './hallStore';
import { useElderStore } from './elderStore';
import { useAlchemyStore } from './alchemyStore';
import { useDaoPathStore } from './daoPathStore';
import type { HallConfigLookup } from './hallStore';

/** Threshold: total revenue must exceed 44.44B to earn any HDP */
const HDP_DIVISOR = D('44440000000'); // 44.44 Billion

export interface PrestigeStoreState {
  totalHDP: number;
  spentHDP: number;
  hdpShopPurchases: Record<string, number>;
  automationUnlocks: Record<string, boolean>;

  // Ascension history
  ascensionHistory: {
    count: number;
    bestHDP: number;
    fastestAscension: number; // in seconds
  };

  // Track total revenue this run for HDP calculation
  totalRevenueThisRun: Decimal;

  // Actions
  addRevenue: (amount: Decimal) => void;
  canAscend: () => boolean;
  getHDPPreview: () => number;
  getHDPMultiplier: () => number;
  spendHDP: (amount: number) => boolean;
  purchaseHDPShopItem: (itemId: string, cost: number) => boolean;
  performAscension: (hallConfigs: HallConfigLookup[], runDuration: number) => void;
  resetForAscension: () => void;
}

export const usePrestigeStore = create<PrestigeStoreState>()((set, get) => ({
  totalHDP: 0,
  spentHDP: 0,
  hdpShopPurchases: {},
  automationUnlocks: {},
  ascensionHistory: {
    count: 0,
    bestHDP: 0,
    fastestAscension: Infinity,
  },
  totalRevenueThisRun: D(0),

  addRevenue: (amount: Decimal) => {
    set((state) => ({
      totalRevenueThisRun: state.totalRevenueThisRun.add(amount),
    }));
  },

  canAscend: () => {
    // Must earn at least 1 HDP to ascend
    return get().getHDPPreview() > 0;
  },

  getHDPPreview: () => {
    const state = get();
    // HDP = floor(sqrt(totalRevenue / 44.44B))
    const ratio = state.totalRevenueThisRun.div(HDP_DIVISOR);
    if (ratio.lt(1)) return 0;
    return Math.floor(Math.sqrt(ratio.toNumber()));
  },

  getHDPMultiplier: () => {
    const state = get();
    // 1 + (totalHDP - spentHDP) * 0.02
    const unspent = state.totalHDP - state.spentHDP;
    return 1 + Math.max(0, unspent) * 0.02;
  },

  spendHDP: (amount: number) => {
    const state = get();
    const available = state.totalHDP - state.spentHDP;
    if (available < amount) return false;
    set({ spentHDP: state.spentHDP + amount });
    return true;
  },

  purchaseHDPShopItem: (itemId: string, cost: number) => {
    const state = get();
    if (!state.spendHDP(cost)) return false;
    set((s) => ({
      hdpShopPurchases: {
        ...s.hdpShopPurchases,
        [itemId]: (s.hdpShopPurchases[itemId] ?? 0) + 1,
      },
    }));
    return true;
  },

  performAscension: (_hallConfigs: HallConfigLookup[], runDuration: number) => {
    const state = get();
    if (!state.canAscend()) return;

    const hdpEarned = state.getHDPPreview();

    // Update ascension history
    set((s) => ({
      totalHDP: s.totalHDP + hdpEarned,
      totalRevenueThisRun: D(0),
      ascensionHistory: {
        count: s.ascensionHistory.count + 1,
        bestHDP: Math.max(s.ascensionHistory.bestHDP, hdpEarned),
        fastestAscension: Math.min(
          s.ascensionHistory.fastestAscension,
          runDuration,
        ),
      },
    }));

    // Reset game store (SS, AE reset; HDP, DC, HS persist)
    useGameStore.getState().ascend(hdpEarned);
    // Reset halls
    useHallStore.getState().resetForAscension();
    // Reset elders
    useElderStore.getState().resetForAscension();
    // Reset alchemy buffs
    useAlchemyStore.getState().clearBuffs();
    // Reset Dao Path spell
    useDaoPathStore.getState().resetSpell();
  },

  resetForAscension: () => {
    set({ totalRevenueThisRun: D(0) });
  },
}));
