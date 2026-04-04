import { create } from 'zustand';
import { MANDATE_CONFIG } from '@data/mandateConfigs';
import { useGameStore } from './gameStore';

export interface MandateStoreState {
  /** hallId -> mandate level (0-4) */
  slots: Record<number, number>;

  // Actions
  initSlots: () => void;
  upgradeMandate: (hallId: number) => boolean;
  getMandateMultiplier: (hallId: number) => number;
  resetForAscension: () => void;
}

export const useMandateStore = create<MandateStoreState>()((set, get) => ({
  slots: {},

  initSlots: () => {
    set(() => {
      const slots: Record<number, number> = {};
      for (let i = 1; i <= 12; i++) {
        slots[i] = 0;
      }
      return { slots };
    });
  },

  upgradeMandate: (hallId: number) => {
    const state = get();
    const currentLevel = state.slots[hallId] ?? 0;

    if (currentLevel >= 4) return false;

    const levelConfig = MANDATE_CONFIG.levels[currentLevel];
    if (!levelConfig) return false;

    const cost = levelConfig.hsCost;
    const gameState = useGameStore.getState();

    if (gameState.heavenlySeals < cost) return false;

    useGameStore.setState({
      heavenlySeals: gameState.heavenlySeals - cost,
    });

    set((s) => ({
      slots: { ...s.slots, [hallId]: currentLevel + 1 },
    }));

    return true;
  },

  getMandateMultiplier: (hallId: number) => {
    const level = get().slots[hallId] ?? 0;
    if (level === 0) return 1;
    const levelConfig = MANDATE_CONFIG.levels[level - 1];
    return levelConfig ? levelConfig.multiplier : 1;
  },

  resetForAscension: () => {
    // Mandates persist across ascension -- no-op
  },
}));
