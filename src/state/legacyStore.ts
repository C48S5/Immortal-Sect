import { create } from 'zustand';
import { QI_RESIDUE_SHOP_CONFIGS } from '@data/qiResidueShopConfigs';
import { useGameStore } from './gameStore';

export interface LegacyFragment {
  type: string;
  discipleName: string;
  hallId: number | null;
  legacyPower: number;
}

export interface LegacyTechnique {
  name: string;
  description: string;
}

export interface LegacyStoreState {
  fragments: LegacyFragment[];
  techniques: LegacyTechnique[];
  /** buffId -> number of times purchased */
  qrShopPurchases: Record<string, number>;

  // Actions
  addFragment: (fragment: LegacyFragment) => void;
  addTechnique: (technique: LegacyTechnique) => void;
  buyQRShopBuff: (buffId: string) => boolean;
  resetForAscension: () => void;
}

export const useLegacyStore = create<LegacyStoreState>()((set, get) => ({
  fragments: [],
  techniques: [],
  qrShopPurchases: {},

  addFragment: (fragment: LegacyFragment) => {
    set((state) => ({
      fragments: [...state.fragments, fragment],
    }));
  },

  addTechnique: (technique: LegacyTechnique) => {
    set((state) => ({
      techniques: [...state.techniques, technique],
    }));
  },

  buyQRShopBuff: (buffId: string) => {
    const config = QI_RESIDUE_SHOP_CONFIGS.find((c) => c.id === buffId);
    if (!config) return false;

    const state = get();
    const currentCount = state.qrShopPurchases[buffId] ?? 0;
    if (currentCount >= config.maxPurchases) return false;

    const gameState = useGameStore.getState();
    if (gameState.qiResidue < config.cost) return false;

    useGameStore.setState({
      qiResidue: gameState.qiResidue - config.cost,
    });

    set((s) => ({
      qrShopPurchases: {
        ...s.qrShopPurchases,
        [buffId]: currentCount + 1,
      },
    }));

    return true;
  },

  resetForAscension: () => {
    // Legacy data persists across ascension -- no-op
  },
}));
