import { create } from 'zustand';
import Decimal from 'break_infinity.js';
import { D } from '../core/BigNumber';

export interface GameSettings {
  soundEnabled: boolean;
  notationsStyle: string;
}

export interface GameStoreState {
  // Currencies
  spiritStones: Decimal;
  hdp: number;
  daoCrystals: number;
  heavenlySeals: number;
  alchemyEssence: Decimal;
  recruitmentTokens: number;
  qiResidue: number;
  legacyPower: number;

  // Meta
  lastSaveTime: number;
  lastTickTime: number;
  totalPlayTime: number;
  ascensionCount: number;
  currentRealm: 'mortal' | 'immortal' | 'celestial';
  activeDaoPath: string | null;
  settings: GameSettings;

  // Actions
  addSpiritStones: (amount: Decimal) => void;
  spendSpiritStones: (amount: Decimal) => boolean;
  addHDP: (amount: number) => void;
  addAE: (amount: Decimal) => void;
  setLastSaveTime: (time: number) => void;
  setLastTickTime: (time: number) => void;
  addPlayTime: (seconds: number) => void;
  updateSettings: (partial: Partial<GameSettings>) => void;
  setActiveDaoPath: (path: string | null) => void;
  ascend: (hdpEarned: number) => void;
  reset: () => void;
}

function createInitialState() {
  return {
    spiritStones: D(0),
    hdp: 0,
    daoCrystals: 0,
    heavenlySeals: 0,
    alchemyEssence: D(0),
    recruitmentTokens: 0,
    qiResidue: 0,
    legacyPower: 0,
    lastSaveTime: Date.now(),
    lastTickTime: Date.now(),
    totalPlayTime: 0,
    ascensionCount: 0,
    currentRealm: 'mortal' as const,
    activeDaoPath: null,
    settings: {
      soundEnabled: true,
      notationsStyle: 'standard',
    },
  };
}

export const useGameStore = create<GameStoreState>()((set, get) => ({
  ...createInitialState(),

  addSpiritStones: (amount: Decimal) => {
    set((state) => ({
      spiritStones: state.spiritStones.add(amount),
    }));
  },

  spendSpiritStones: (amount: Decimal) => {
    const state = get();
    if (state.spiritStones.lt(amount)) return false;
    set({ spiritStones: state.spiritStones.sub(amount) });
    return true;
  },

  addHDP: (amount: number) => {
    set((state) => ({ hdp: state.hdp + amount }));
  },

  addAE: (amount: Decimal) => {
    set((state) => ({
      alchemyEssence: state.alchemyEssence.add(amount),
    }));
  },

  setLastSaveTime: (time: number) => {
    set({ lastSaveTime: time });
  },

  setLastTickTime: (time: number) => {
    set({ lastTickTime: time });
  },

  addPlayTime: (seconds: number) => {
    set((state) => ({
      totalPlayTime: state.totalPlayTime + seconds,
    }));
  },

  updateSettings: (partial: Partial<GameSettings>) => {
    set((state) => ({
      settings: { ...state.settings, ...partial },
    }));
  },

  setActiveDaoPath: (path: string | null) => {
    set({ activeDaoPath: path });
  },

  ascend: (hdpEarned: number) => {
    set((state) => ({
      // Reset currencies that don't persist
      spiritStones: D(0),
      alchemyEssence: D(0),
      // Add earned HDP
      hdp: state.hdp + hdpEarned,
      // Keep persistent currencies: daoCrystals, heavenlySeals, qiResidue, recruitmentTokens
      ascensionCount: state.ascensionCount + 1,
    }));
  },

  reset: () => {
    set(createInitialState());
  },
}));
