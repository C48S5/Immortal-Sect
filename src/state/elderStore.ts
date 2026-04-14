import { create } from 'zustand';
import Decimal from 'break_infinity.js';
import { useGameStore } from './gameStore';
import { useHallStore } from './hallStore';
import { useChallengeStore } from './challengeStore';

// TODO: Import ElderConfig from src/data/ once available
export interface ElderConfigLookup {
  id: number;
  hallId: number;
  cost: Decimal;
}

export interface ElderSlot {
  hired: boolean;
}

export interface ElderStoreState {
  elders: Record<number, ElderSlot>;

  // Actions
  initElder: (id: number) => void;
  hireElder: (id: number, config: ElderConfigLookup) => boolean;
  canAffordElder: (id: number, config: ElderConfigLookup) => boolean;
  canHireUnderRestrictions: (id: number, config: ElderConfigLookup) => boolean;
  isHired: (id: number) => boolean;
  canHireElder: (id: number) => boolean;
  resetForAscension: () => void;
}

export const useElderStore = create<ElderStoreState>()((set, get) => ({
  elders: {},

  initElder: (id: number) => {
    set((state) => {
      if (state.elders[id]) return state;
      return {
        elders: { ...state.elders, [id]: { hired: false } },
      };
    });
  },

  hireElder: (id: number, config: ElderConfigLookup) => {
    const state = get();
    const elder = state.elders[id];
    if (!elder || elder.hired) return false;

    // Check affordability
    if (!state.canAffordElder(id, config)) return false;

    // Spend spirit stones
    const spent = useGameStore.getState().spendSpiritStones(config.cost);
    if (!spent) return false;

    // Mark elder as hired
    set((s) => ({
      elders: {
        ...s.elders,
        [id]: { hired: true },
      },
    }));

    // Automate the corresponding hall
    useHallStore.getState().setAutomated(config.hallId, true);

    return true;
  },

  canAffordElder: (id: number, config: ElderConfigLookup) => {
    const elder = get().elders[id];
    if (!elder || elder.hired) return false;

    const spiritStones = useGameStore.getState().spiritStones;
    return spiritStones.gte(config.cost);
  },

  canHireUnderRestrictions: (id: number, config: ElderConfigLookup) => {
    const allEldersDisabled = useChallengeStore.getState().isRestrictionActive(
      'No Elders allowed',
    );
    if (allEldersDisabled) return false;
    return get().canAffordElder(id, config);
  },

  isHired: (id: number) => {
    const elder = get().elders[id];
    return elder?.hired ?? false;
  },

  canHireElder: (id: number) => {
    const elder = get().elders[id];
    return !!elder && !elder.hired;
  },

  resetForAscension: () => {
    set((state) => {
      const newElders: Record<number, ElderSlot> = {};
      for (const idStr of Object.keys(state.elders)) {
        newElders[Number(idStr)] = { hired: false };
      }
      return { elders: newElders };
    });
  },
}));
