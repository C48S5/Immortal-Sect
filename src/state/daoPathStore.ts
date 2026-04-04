import { create } from 'zustand';
import {
  tickSpell as daoTickSpell,
  computeSpellEffects,
  getPathConfig,
} from '@systems/DaoPathSystem';
import { useGameStore } from './gameStore';
import type { DaoPathState } from '@models/daoPath';

export interface SpellEffects {
  hallMultipliers: Record<number, number>;
  globalMultiplier: number;
  aeMultiplier: number;
  treasureRateMultiplier: number;
}

export interface DaoPathStoreState {
  spellActive: boolean;
  spellRemainingDuration: number;
  spellCooldownRemaining: number;
  spellEffects: SpellEffects;
  activateSpell: () => boolean;
  tickSpell: (deltaTime: number) => void;
  resetSpell: () => void;
}

const DEFAULT_EFFECTS: SpellEffects = {
  hallMultipliers: {},
  globalMultiplier: 1,
  aeMultiplier: 1,
  treasureRateMultiplier: 1,
};

export const useDaoPathStore = create<DaoPathStoreState>()((set, get) => ({
  spellActive: false,
  spellRemainingDuration: 0,
  spellCooldownRemaining: 0,
  spellEffects: { ...DEFAULT_EFFECTS },

  activateSpell: () => {
    const activeDaoPath = useGameStore.getState().activeDaoPath;
    if (activeDaoPath === null) return false;

    const pathId = parseInt(activeDaoPath, 10);
    if (isNaN(pathId)) return false;

    const config = getPathConfig(pathId);
    if (!config) return false;

    const state = get();
    if (state.spellActive) return false;
    if (state.spellCooldownRemaining > 0) return false;

    set({
      spellActive: true,
      spellRemainingDuration: config.spell.activeDuration,
    });

    return true;
  },

  tickSpell: (deltaTime: number) => {
    const state = get();
    const activeDaoPath = useGameStore.getState().activeDaoPath;

    if (!state.spellActive && state.spellCooldownRemaining <= 0) return;

    const pathId = activeDaoPath !== null ? parseInt(activeDaoPath, 10) : null;

    const daoPathState: DaoPathState = {
      selectedPathId: isNaN(pathId as number) ? null : pathId,
      spellActive: state.spellActive,
      spellRemainingDuration: state.spellRemainingDuration,
      spellCooldownRemaining: state.spellCooldownRemaining,
    };

    const updated = daoTickSpell(daoPathState, deltaTime);

    let effects = { ...DEFAULT_EFFECTS };
    if (updated.spellActive) {
      effects = computeSpellEffects(updated, 12);
    }

    set({
      spellActive: updated.spellActive,
      spellRemainingDuration: updated.spellRemainingDuration,
      spellCooldownRemaining: updated.spellCooldownRemaining,
      spellEffects: effects,
    });
  },

  resetSpell: () => {
    set({
      spellActive: false,
      spellRemainingDuration: 0,
      spellCooldownRemaining: 0,
      spellEffects: { ...DEFAULT_EFFECTS },
    });
  },
}));
