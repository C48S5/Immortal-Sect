import { create } from 'zustand';
import Decimal from 'break_infinity.js';
import { CHALLENGE_CONFIGS } from '@data/challengeConfigs';

export interface ChallengeSlot {
  completed: boolean;
  active: boolean;
  /** Decimal serialized as string for Zustand compatibility */
  currentEarnings: string;
}

export interface ChallengeStoreState {
  challenges: Record<number, ChallengeSlot>;

  // Actions
  initChallenges: () => void;
  enterChallenge: (id: number) => boolean;
  exitChallenge: () => void;
  addChallengeEarnings: (amount: Decimal) => void;
  getActiveChallenge: () => number | null;
  resetForAscension: () => void;
}

function createDefaultSlot(): ChallengeSlot {
  return {
    completed: false,
    active: false,
    currentEarnings: '0',
  };
}

export const useChallengeStore = create<ChallengeStoreState>()(
  (set, get) => ({
    challenges: {},

    initChallenges: () => {
      set(() => {
        const challenges: Record<number, ChallengeSlot> = {};
        for (const config of CHALLENGE_CONFIGS) {
          challenges[config.id] = createDefaultSlot();
        }
        return { challenges };
      });
    },

    enterChallenge: (id: number) => {
      const state = get();
      const slot = state.challenges[id];
      if (!slot) return false;
      if (slot.completed || slot.active) return false;

      // Only one challenge can be active at a time
      const alreadyActive = get().getActiveChallenge();
      if (alreadyActive !== null) return false;

      set((s) => ({
        challenges: {
          ...s.challenges,
          [id]: { ...slot, active: true, currentEarnings: '0' },
        },
      }));

      return true;
    },

    exitChallenge: () => {
      const activeId = get().getActiveChallenge();
      if (activeId === null) return;

      set((s) => {
        const slot = s.challenges[activeId];
        if (!slot) return s;
        return {
          challenges: {
            ...s.challenges,
            [activeId]: { ...slot, active: false, currentEarnings: '0' },
          },
        };
      });
    },

    addChallengeEarnings: (amount: Decimal) => {
      const activeId = get().getActiveChallenge();
      if (activeId === null) return;

      set((s) => {
        const slot = s.challenges[activeId];
        if (!slot || !slot.active) return s;

        const current = new Decimal(slot.currentEarnings);
        const updated = current.add(amount);

        // Check if target reached
        const config = CHALLENGE_CONFIGS.find((c) => c.id === activeId);
        if (config && updated.gte(config.targetEarnings)) {
          return {
            challenges: {
              ...s.challenges,
              [activeId]: {
                completed: true,
                active: false,
                currentEarnings: updated.toString(),
              },
            },
          };
        }

        return {
          challenges: {
            ...s.challenges,
            [activeId]: {
              ...slot,
              currentEarnings: updated.toString(),
            },
          },
        };
      });
    },

    getActiveChallenge: () => {
      const challenges = get().challenges;
      for (const [idStr, slot] of Object.entries(challenges)) {
        if (slot.active) return Number(idStr);
      }
      return null;
    },

    resetForAscension: () => {
      // Challenge completions persist across ascension -- no-op
    },
  }),
);
