import { create } from 'zustand';
import Decimal from 'break_infinity.js';
import { D } from '@core/BigNumber';
import {
  SECRET_REALM_CONFIGS,
  IDLE_FARMING_TIERS,
  REALM_KEY_CONFIG,
} from '@data/secretRealmConfigs';
import { useGameStore } from './gameStore';

export interface RealmSlot {
  highestFloorEver: number;
  highestFloorThisRun: number;
  uncollectedIdleHours: number;
  realmKeys: number;
  lastKeyRegenTimestamp: number;
}

export interface DungeonStoreState {
  realms: Record<string, RealmSlot>;

  // Actions
  initRealms: () => void;
  pushFloor: (realmId: string) => boolean;
  retreat: (realmId: string) => void;
  collectIdleRewards: (realmId: string) => void;
  tickIdleFarming: (dt: number) => void;
  resetForAscension: () => void;
}

function createDefaultRealm(): RealmSlot {
  return {
    highestFloorEver: 0,
    highestFloorThisRun: 0,
    uncollectedIdleHours: 0,
    realmKeys: 5,
    lastKeyRegenTimestamp: Date.now(),
  };
}

/**
 * Find the best idle farming tier for a given highest floor.
 * Returns null if floor is below the minimum tier threshold.
 */
function getIdleTier(highestFloor: number) {
  let bestTier = null;
  for (const tier of IDLE_FARMING_TIERS) {
    if (highestFloor >= tier.minFloor) {
      bestTier = tier;
    }
  }
  return bestTier;
}

export const useDungeonStore = create<DungeonStoreState>()((set, get) => ({
  realms: {},

  initRealms: () => {
    set(() => {
      const realms: Record<string, RealmSlot> = {};
      for (const config of SECRET_REALM_CONFIGS) {
        realms[config.id] = createDefaultRealm();
      }
      return { realms };
    });
  },

  pushFloor: (realmId: string) => {
    const state = get();
    const realm = state.realms[realmId];
    if (!realm) return false;
    if (realm.realmKeys <= 0) return false;

    const realmConfig = SECRET_REALM_CONFIGS.find((c) => c.id === realmId);
    if (!realmConfig) return false;

    const nextFloor = realm.highestFloorThisRun + 1;
    if (nextFloor > realmConfig.totalFloors) return false;

    set((s) => {
      const current = s.realms[realmId];
      if (!current) return s;
      const newHighestEver = Math.max(current.highestFloorEver, nextFloor);
      return {
        realms: {
          ...s.realms,
          [realmId]: {
            ...current,
            realmKeys: current.realmKeys - 1,
            highestFloorThisRun: nextFloor,
            highestFloorEver: newHighestEver,
          },
        },
      };
    });

    return true;
  },

  retreat: (realmId: string) => {
    // Retreat resets the current run floor to 0 (no key refund)
    set((s) => {
      const realm = s.realms[realmId];
      if (!realm) return s;
      return {
        realms: {
          ...s.realms,
          [realmId]: { ...realm, highestFloorThisRun: 0 },
        },
      };
    });
  },

  collectIdleRewards: (realmId: string) => {
    const state = get();
    const realm = state.realms[realmId];
    if (!realm || realm.uncollectedIdleHours <= 0) return;

    const tier = getIdleTier(realm.highestFloorEver);
    if (!tier) return;

    const hours = realm.uncollectedIdleHours;

    // Calculate rewards
    const ssReward: Decimal = tier.ssPerHour.mul(hours);
    const rtReward = Math.floor(tier.rtPerHour * hours);
    const aeReward: Decimal = D(tier.aePerHour).mul(hours);

    // Add rewards to game store
    const gameState = useGameStore.getState();
    useGameStore.getState().addSpiritStones(ssReward);
    useGameStore.setState({
      recruitmentTokens: gameState.recruitmentTokens + rtReward,
    });
    useGameStore.getState().addAE(aeReward);

    // Reset uncollected hours
    set((s) => {
      const current = s.realms[realmId];
      if (!current) return s;
      return {
        realms: {
          ...s.realms,
          [realmId]: { ...current, uncollectedIdleHours: 0 },
        },
      };
    });
  },

  tickIdleFarming: (dt: number) => {
    const dtHours = dt / 3600;
    if (dtHours <= 0) return;

    set((s) => {
      const newRealms = { ...s.realms };
      let hasChange = false;

      for (const [realmId, realm] of Object.entries(newRealms)) {
        // Only accumulate if the realm has been cleared at least to the minimum tier
        const tier = getIdleTier(realm.highestFloorEver);
        if (!tier) continue;

        const newHours = Math.min(
          realm.uncollectedIdleHours + dtHours,
          REALM_KEY_CONFIG.maxIdleHours,
        );

        if (newHours !== realm.uncollectedIdleHours) {
          hasChange = true;
          newRealms[realmId] = { ...realm, uncollectedIdleHours: newHours };
        }

        // Key regeneration
        const hoursSinceRegen =
          (Date.now() - realm.lastKeyRegenTimestamp) / 3600000;
        if (
          hoursSinceRegen >= REALM_KEY_CONFIG.regenHours &&
          realm.realmKeys < REALM_KEY_CONFIG.maxStoredKeys
        ) {
          const keysToAdd = Math.min(
            Math.floor(hoursSinceRegen / REALM_KEY_CONFIG.regenHours),
            REALM_KEY_CONFIG.maxStoredKeys - realm.realmKeys,
          );
          if (keysToAdd > 0) {
            hasChange = true;
            newRealms[realmId] = {
              ...(newRealms[realmId] ?? realm),
              realmKeys: realm.realmKeys + keysToAdd,
              lastKeyRegenTimestamp:
                realm.lastKeyRegenTimestamp +
                keysToAdd * REALM_KEY_CONFIG.regenHours * 3600000,
            };
          }
        }
      }

      return hasChange ? { realms: newRealms } : s;
    });
  },

  resetForAscension: () => {
    set((s) => {
      const newRealms: Record<string, RealmSlot> = {};
      for (const [realmId, realm] of Object.entries(s.realms)) {
        newRealms[realmId] = {
          ...realm,
          highestFloorThisRun: 0,
        };
      }
      return { realms: newRealms };
    });
  },
}));
