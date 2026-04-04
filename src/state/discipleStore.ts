import { create } from 'zustand';
import { Rarity } from '@models/disciple';
import {
  DISCIPLE_CONFIGS,
  PULL_RATES,
  GACHA_CONFIG,
} from '@data/discipleConfigs';
import { useGameStore } from './gameStore';
import { useLegacyStore } from './legacyStore';
import { processDiscipleDeath } from '@systems/LegacySystem';

/** QR value per rarity when a disciple dies */
const QR_ON_DEATH: Record<string, number> = {
  [Rarity.Common]: 1,
  [Rarity.Uncommon]: 3,
  [Rarity.Rare]: 5,
  [Rarity.Epic]: 15,
  [Rarity.Legendary]: 50,
};

export interface DiscipleInstance {
  instanceId: string;
  configId: string;
  rarity: string;
  assignedHallId: number | null;
  deployedRealmId: string | null;
  alive: boolean;
}

export interface DiscipleStoreState {
  roster: DiscipleInstance[];
  totalPulls: number;
  pullsSincePity: number;

  // Actions
  pull: (count: 1 | 10) => DiscipleInstance[];
  assignToHall: (instanceId: string, hallId: number | null) => void;
  killDisciple: (instanceId: string) => void;
  resetForAscension: () => void;
}

/** Build cumulative thresholds from PULL_RATES */
function buildCumulativeRates(): Array<{ rarity: Rarity; cumulative: number }> {
  const result: Array<{ rarity: Rarity; cumulative: number }> = [];
  let cumulative = 0;
  for (const pr of PULL_RATES) {
    cumulative += pr.rate;
    result.push({ rarity: pr.rarity, cumulative });
  }
  return result;
}

const CUMULATIVE_RATES = buildCumulativeRates();

function rollRarity(isPity: boolean): Rarity {
  if (isPity) {
    // Hard pity guarantees Epic or better
    const roll = Math.random();
    // Epic rate / (Epic + Legendary) to split between Epic and Legendary
    const epicRate = 0.06;
    const legendaryRate = 0.02;
    const total = epicRate + legendaryRate;
    return roll < epicRate / total ? Rarity.Epic : Rarity.Legendary;
  }

  const roll = Math.random();
  for (const entry of CUMULATIVE_RATES) {
    if (roll < entry.cumulative) return entry.rarity;
  }
  return Rarity.Common;
}

function pickRandomConfig(rarity: Rarity) {
  const matching = DISCIPLE_CONFIGS.filter((c) => c.rarity === rarity);
  if (matching.length === 0) {
    // Fallback: pick any config
    return DISCIPLE_CONFIGS[0];
  }
  return matching[Math.floor(Math.random() * matching.length)];
}

export const useDiscipleStore = create<DiscipleStoreState>()((set, get) => ({
  roster: [],
  totalPulls: 0,
  pullsSincePity: 0,

  pull: (count: 1 | 10) => {
    const cost =
      count === 1 ? GACHA_CONFIG.singlePullCost : GACHA_CONFIG.tenPullCost;
    const gameState = useGameStore.getState();

    if (gameState.recruitmentTokens < cost) return [];

    useGameStore.setState({
      recruitmentTokens: gameState.recruitmentTokens - cost,
    });

    const state = get();
    let pullsSincePity = state.pullsSincePity;
    let totalPulls = state.totalPulls;
    const newDisciples: DiscipleInstance[] = [];

    for (let i = 0; i < count; i++) {
      pullsSincePity++;
      totalPulls++;

      const isPity = pullsSincePity >= GACHA_CONFIG.hardPityPulls;
      const rarity = rollRarity(isPity);

      if (
        rarity === Rarity.Epic ||
        rarity === Rarity.Legendary
      ) {
        pullsSincePity = 0;
      }

      const config = pickRandomConfig(rarity);
      const instance: DiscipleInstance = {
        instanceId: crypto.randomUUID(),
        configId: config.id,
        rarity: config.rarity,
        assignedHallId: null,
        deployedRealmId: null,
        alive: true,
      };
      newDisciples.push(instance);
    }

    set({
      roster: [...state.roster, ...newDisciples],
      totalPulls,
      pullsSincePity,
    });

    return newDisciples;
  },

  assignToHall: (instanceId: string, hallId: number | null) => {
    set((state) => ({
      roster: state.roster.map((d) =>
        d.instanceId === instanceId ? { ...d, assignedHallId: hallId } : d,
      ),
    }));
  },

  killDisciple: (instanceId: string) => {
    const state = get();
    const disciple = state.roster.find((d) => d.instanceId === instanceId);
    if (!disciple || !disciple.alive) return;

    // Mark as dead first
    set((s) => ({
      roster: s.roster.map((d) =>
        d.instanceId === instanceId
          ? { ...d, alive: false, assignedHallId: null, deployedRealmId: null }
          : d,
      ),
    }));

    // Look up disciple config
    const discipleConfig = DISCIPLE_CONFIGS.find((c) => c.id === disciple.configId);
    if (!discipleConfig) {
      // Fallback: just add base QR
      const qrGain = QR_ON_DEATH[disciple.rarity] ?? 1;
      useGameStore.setState((gs) => ({ qiResidue: gs.qiResidue + qrGain }));
      return;
    }

    // Process death through legacy system
    const legacyState = {
      legacyPower: useGameStore.getState().legacyPower,
      fragments: useLegacyStore.getState().fragments.map((f) => ({
        discipleConfigId: f.discipleName,
        type: f.type as 'minor' | 'major' | 'mythic',
        legacyPower: f.legacyPower,
      })),
      qiResidueBuffsPurchased: {},
    };

    const result = processDiscipleDeath(discipleConfig, legacyState);

    // Add QR to gameStore
    useGameStore.setState((gs) => ({
      qiResidue: gs.qiResidue + result.qiResidue,
      legacyPower: gs.legacyPower + result.legacyPowerGained,
    }));

    // Add fragment to legacyStore if returned
    if (result.fragment) {
      useLegacyStore.getState().addFragment({
        type: result.fragment.type,
        discipleName: discipleConfig.name,
        hallId: disciple.assignedHallId,
        legacyPower: result.fragment.legacyPower,
      });
    }
  },

  resetForAscension: () => {
    // Disciples persist across ascension -- no-op
  },
}));
