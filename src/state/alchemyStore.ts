import { create } from 'zustand';
import type { ActiveBuff } from '@models/alchemy';

export interface AlchemyStoreState {
  activeBuffs: ActiveBuff[];
  addBuff: (buff: ActiveBuff) => void;
  tickBuffs: (deltaTime: number) => void;
  getAlchemyMultiplier: (hallId: number) => number;
  clearBuffs: () => void;
}

export const useAlchemyStore = create<AlchemyStoreState>()((set, get) => ({
  activeBuffs: [],

  addBuff: (buff: ActiveBuff) => {
    set((state) => ({
      activeBuffs: [...state.activeBuffs, buff],
    }));
  },

  tickBuffs: (deltaTime: number) => {
    set((state) => {
      const updated = state.activeBuffs
        .map((b) => ({
          ...b,
          remainingSeconds: b.remainingSeconds - deltaTime,
        }))
        .filter((b) => b.remainingSeconds > 0);

      if (updated.length === state.activeBuffs.length) {
        // Check if any actually changed
        const anyChanged = state.activeBuffs.some(
          (b, i) => b.remainingSeconds !== updated[i].remainingSeconds,
        );
        if (!anyChanged) return state;
      }

      return { activeBuffs: updated };
    });
  },

  getAlchemyMultiplier: (hallId: number) => {
    const buffs = get().activeBuffs;
    let multiplier = 1;

    for (const buff of buffs) {
      // Empty affectedHallIds means the buff applies to all halls
      if (
        buff.affectedHallIds.length === 0 ||
        buff.affectedHallIds.includes(hallId)
      ) {
        multiplier *= buff.multiplier;
      }
    }

    return multiplier;
  },

  clearBuffs: () => {
    set({ activeBuffs: [] });
  },
}));
