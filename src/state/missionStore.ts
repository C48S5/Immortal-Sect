import { create } from 'zustand';
import { D } from '@core/BigNumber';
import { MISSION_POOL, DAILY_CHECK_IN_RT, DAILY_MISSION_COUNT } from '@data/missionConfigs';
import { useGameStore } from './gameStore';
import type { MissionInstance, MissionType } from '@models/mission';

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Pick N random unique missions from the pool using a seeded shuffle */
function pickDailyMissions(count: number): MissionInstance[] {
  const shuffled = [...MISSION_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((config) => ({
    configId: config.id,
    progress: 0,
    completed: false,
    claimed: false,
  }));
}

export interface MissionStoreState {
  missions: MissionInstance[];
  lastRefreshDate: string;
  dailyCheckInClaimed: boolean;

  /** Check if missions need to be refreshed for a new day */
  refreshIfNeeded: () => void;
  /** Increment progress for a mission type */
  addProgress: (type: MissionType, amount: number) => void;
  /** Claim a completed mission's rewards */
  claimMission: (configId: string) => boolean;
  /** Claim the daily check-in bonus */
  claimDailyCheckIn: () => boolean;
}

export const useMissionStore = create<MissionStoreState>()((set, get) => ({
  missions: [],
  lastRefreshDate: '',
  dailyCheckInClaimed: false,

  refreshIfNeeded: () => {
    const today = getTodayString();
    if (get().lastRefreshDate === today) return;

    set({
      missions: pickDailyMissions(DAILY_MISSION_COUNT),
      lastRefreshDate: today,
      dailyCheckInClaimed: false,
    });
  },

  addProgress: (type: MissionType, amount: number) => {
    set((state) => {
      let changed = false;
      const updated = state.missions.map((m) => {
        if (m.claimed) return m;
        const config = MISSION_POOL.find((c) => c.id === m.configId);
        if (!config || config.type !== type) return m;

        const newProgress = Math.min(m.progress + amount, config.target);
        if (newProgress === m.progress) return m;
        changed = true;
        return {
          ...m,
          progress: newProgress,
          completed: newProgress >= config.target,
        };
      });
      return changed ? { missions: updated } : state;
    });
  },

  claimMission: (configId: string) => {
    const state = get();
    const mission = state.missions.find((m) => m.configId === configId);
    if (!mission || !mission.completed || mission.claimed) return false;

    const config = MISSION_POOL.find((c) => c.id === configId);
    if (!config) return false;

    const gs = useGameStore.getState();
    if (config.rtReward > 0) {
      useGameStore.setState({ recruitmentTokens: gs.recruitmentTokens + config.rtReward });
    }
    if (config.aeReward > 0) {
      gs.addAE(D(config.aeReward));
    }

    set((s) => ({
      missions: s.missions.map((m) =>
        m.configId === configId ? { ...m, claimed: true } : m,
      ),
    }));
    return true;
  },

  claimDailyCheckIn: () => {
    if (get().dailyCheckInClaimed) return false;

    const gs = useGameStore.getState();
    useGameStore.setState({ recruitmentTokens: gs.recruitmentTokens + DAILY_CHECK_IN_RT });
    set({ dailyCheckInClaimed: true });
    return true;
  },
}));
