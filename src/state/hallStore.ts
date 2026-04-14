import { create } from 'zustand';
import Decimal from 'break_infinity.js';
import { D, bulkCost, maxAffordable } from '../core/BigNumber';
import { useGameStore } from './gameStore';
import { usePrestigeStore } from './prestigeStore';
import { useMandateStore } from './mandateStore';
import { useDiscipleStore } from './discipleStore';
import { useChallengeStore } from './challengeStore';
import { useLegacyStore } from './legacyStore';
import { useAlchemyStore } from './alchemyStore';
import { useDaoPathStore } from './daoPathStore';
import { DAO_PATH_CONFIGS } from '@data/daoPathConfigs';
import { DISCIPLE_CONFIGS, PULL_RATES } from '@data/discipleConfigs';
import { HALL_CONFIGS } from '@data/hallConfigs';
import { CHALLENGE_CONFIGS } from '@data/challengeConfigs';
import { QI_RESIDUE_SHOP_CONFIGS } from '@data/qiResidueShopConfigs';
import { getDisabledHalls } from '@systems/ChallengeSystem';

// TODO: Import HallConfig from src/data/ once available
// For now, inline hall config lookup type
export interface HallConfigLookup {
  id: number;
  baseCost: Decimal;
  coefficient: number;
  cycleSeconds: number;
  baseRevenue: Decimal;
}

/** Buy mode options */
export type BuyMode = 1 | 10 | 100 | 'max';

export interface HallSlot {
  level: number;
  cycleProgress: number; // 0-1, fraction of cycle complete
  isAutomated: boolean;
  isUnlocked: boolean;
  speedMultiplier: Decimal;
  profitMultiplier: Decimal;
}

export interface HallStoreState {
  halls: Record<number, HallSlot>;
  buyMode: BuyMode;
  challengeRestrictionMultiplier: Decimal;

  // Actions
  initHall: (id: number) => void;
  unlockHall: (id: number) => void;
  buyHall: (id: number, count: number) => void;
  buyWithMode: (id: number, config: HallConfigLookup) => void;
  tickCycles: (deltaTime: number, hallConfigs: HallConfigLookup[]) => void;
  getRevenue: (id: number, config: HallConfigLookup) => Decimal;
  getTotalRevenuePerSecond: (hallConfigs: HallConfigLookup[]) => Decimal;
  setBuyMode: (mode: BuyMode) => void;
  startManualCycle: (id: number) => void;
  setAutomated: (id: number, automated: boolean) => void;
  setSpeedMultiplier: (id: number, mult: Decimal) => void;
  setProfitMultiplier: (id: number, mult: Decimal) => void;
  setChallengeRestrictionMultiplier: (mult: Decimal) => void;
  getRevenueBreakdown: (id: number, config: HallConfigLookup) => {
    base: Decimal;
    hdp: Decimal;
    mandate: Decimal;
    daoPath: Decimal;
    alchemy: Decimal;
    disciple: Decimal;
    legacy: Decimal;
    challenge: Decimal;
    spell: Decimal;
    qr: Decimal;
    total: Decimal;
  };
  resetForAscension: () => void;
}

function createDefaultHall(): HallSlot {
  return {
    level: 0,
    cycleProgress: 0,
    isAutomated: false,
    isUnlocked: false,
    speedMultiplier: D(1),
    profitMultiplier: D(1),
  };
}

export const useHallStore = create<HallStoreState>()((set, get) => ({
  halls: {},
  buyMode: 1,
  challengeRestrictionMultiplier: D(1),

  initHall: (id: number) => {
    set((state) => {
      if (state.halls[id]) return state;
      return {
        halls: { ...state.halls, [id]: createDefaultHall() },
      };
    });
  },

  unlockHall: (id: number) => {
    set((state) => {
      const hall = state.halls[id] ?? createDefaultHall();
      return {
        halls: {
          ...state.halls,
          [id]: { ...hall, isUnlocked: true },
        },
      };
    });
  },

  buyHall: (id: number, count: number) => {
    if (count <= 0) return;
    set((state) => {
      const hall = state.halls[id];
      if (!hall || !hall.isUnlocked) return state;
      return {
        halls: {
          ...state.halls,
          [id]: { ...hall, level: hall.level + count },
        },
      };
    });
  },

  buyWithMode: (id: number, config: HallConfigLookup) => {
    const state = get();
    const hall = state.halls[id];
    if (!hall || !hall.isUnlocked) return;

    const gameState = useGameStore.getState();
    const budget = gameState.spiritStones;
    let count: number;

    const mode = state.buyMode;
    if (mode === 'max') {
      count = maxAffordable(config.baseCost, config.coefficient, hall.level, budget);
    } else {
      count = mode as number;
      const cost = bulkCost(config.baseCost, config.coefficient, hall.level, count);
      if (budget.lt(cost)) return;
    }

    if (count <= 0) return;

    const cost = bulkCost(config.baseCost, config.coefficient, hall.level, count);
    const spent = gameState.spendSpiritStones(cost);
    if (!spent) return;

    get().buyHall(id, count);
  },

  tickCycles: (deltaTime: number, hallConfigs: HallConfigLookup[]) => {
    set((state) => {
      const newHalls = { ...state.halls };
      let hasChange = false;

      for (const config of hallConfigs) {
        const hall = newHalls[config.id];
        if (!hall || !hall.isUnlocked || hall.level <= 0) continue;

        // Only tick if automated OR manually running (cycleProgress > 0 implies started)
        if (!hall.isAutomated && hall.cycleProgress === 0) continue;

        const cycleTime = config.cycleSeconds / hall.speedMultiplier.toNumber();
        const progressIncrement = deltaTime / cycleTime;
        let newProgress = hall.cycleProgress + progressIncrement;

        if (newProgress >= 1) {
          // Cycle completed - earn revenue
          const revenue = get().getRevenue(config.id, config);
          useGameStore.getState().addSpiritStones(revenue);
          usePrestigeStore.getState().addRevenue(revenue);
          // Automated halls (Elder hired) auto-repeat. Manual halls stop.
          newProgress = hall.isAutomated ? newProgress - 1 : 0;
        }

        if (newProgress !== hall.cycleProgress) {
          hasChange = true;
          newHalls[config.id] = { ...hall, cycleProgress: newProgress };
        }
      }

      return hasChange ? { halls: newHalls } : state;
    });
  },

  getRevenue: (id: number, config: HallConfigLookup) => {
    const hall = get().halls[id];
    if (!hall || hall.level <= 0) return D(0);

    // Active challenge restrictions that directly disable hall income.
    const challengeSlots = Object.entries(useChallengeStore.getState().challenges).map(
      ([challengeId, slot]) => ({
        challengeId: Number(challengeId),
        completed: slot.completed,
        active: slot.active,
        currentEarnings: D(slot.currentEarnings),
      }),
    );
    const disabledHalls = getDisabledHalls(challengeSlots);
    if (disabledHalls.includes(id)) return D(0);
    const activeChallengeId = useChallengeStore.getState().getActiveChallenge();
    // Challenge 9: offline-only run, challenge 12 includes all restrictions.
    if (activeChallengeId === 9 || activeChallengeId === 12) return D(0);

    // 1. Base: baseRevenue * level * profitMultiplier (milestone)
    let revenue = config.baseRevenue.mul(hall.level).mul(hall.profitMultiplier);

    // 2. HDP multiplier
    const hdpMult = usePrestigeStore.getState().getHDPMultiplier();
    revenue = revenue.mul(hdpMult);

    // 3. Mandate multiplier
    const mandateMult = useMandateStore.getState().getMandateMultiplier(id);
    revenue = revenue.mul(mandateMult);

    // 4. Dao Path passive: boosted halls get hallMultiplier
    const activeDaoPath = useGameStore.getState().activeDaoPath;
    if (activeDaoPath !== null) {
      const pathId = parseInt(activeDaoPath, 10);
      if (!isNaN(pathId)) {
        const pathConfig = DAO_PATH_CONFIGS.find((p) => p.id === pathId);
        if (pathConfig && pathConfig.boostedHallIds.includes(id)) {
          revenue = revenue.mul(pathConfig.hallMultiplier);
        }
      }
    }

    // 5. Alchemy buffs
    const alchemyMult = useAlchemyStore.getState().getAlchemyMultiplier(id);
    revenue = revenue.mul(alchemyMult);

    // 6. Disciple bonus: rarity multiplier * element match, capped at 5.0
    const roster = useDiscipleStore.getState().roster;
    const assigned = roster.find(
      (d) => d.assignedHallId === id && d.alive,
    );
    if (assigned) {
      const dConfig = DISCIPLE_CONFIGS.find((c) => c.id === assigned.configId);
      if (dConfig) {
        const pullRate = PULL_RATES.find((pr) => pr.rarity === dConfig.rarity);
        const rarityMult = pullRate ? pullRate.rarityMultiplier : 1;

        // Element match check
        const hallConfig = HALL_CONFIGS.find((h) => h.id === id);
        let elementMult = 1;
        if (hallConfig) {
          if (
            hallConfig.matchingRoot === 'any' ||
            hallConfig.matchingRoot === dConfig.root
          ) {
            elementMult = 2;
          }
        }

        const discipleBonus = Math.min(rarityMult * elementMult, 5.0);
        revenue = revenue.mul(discipleBonus);
      }
    }

    // 7. Legacy Power: 1 + log10(1 + LP) * 0.5
    const legacyPower = useGameStore.getState().legacyPower;
    const legacyMult = 1 + Math.log10(1 + legacyPower) * 0.5;
    revenue = revenue.mul(legacyMult);

    // 8. Challenge rewards: allIncomeMult and hallProfitMult
    const challenges = useChallengeStore.getState().challenges;
    for (const challengeConfig of CHALLENGE_CONFIGS) {
      const slot = challenges[challengeConfig.id];
      if (!slot || !slot.completed) continue;

      if (challengeConfig.rewardType === 'allIncomeMult') {
        revenue = revenue.mul(challengeConfig.rewardValue);
      }
      if (challengeConfig.rewardType === 'hallProfitMult') {
        // hallProfitMult challenges apply to specific halls based on the challenge
        // Challenge 1 ("One Path") targets Hall 1, Challenge 7 ("Sword Only") targets Hall 7
        const hallTargetMap: Record<number, number[]> = {
          1: [1],
          7: [7],
        };
        const targetHalls = hallTargetMap[challengeConfig.id];
        if (targetHalls && targetHalls.includes(id)) {
          revenue = revenue.mul(challengeConfig.rewardValue);
        }
      }
    }

    // 9. Spell effects: globalMultiplier + per-hall multiplier
    const spellEffects = useDaoPathStore.getState().spellEffects;
    revenue = revenue.mul(spellEffects.globalMultiplier);
    const hallSpellMult = spellEffects.hallMultipliers[id];
    if (hallSpellMult !== undefined) {
      revenue = revenue.mul(hallSpellMult);
    }

    // 10. QR Shop buffs
    const qrPurchases = useLegacyStore.getState().qrShopPurchases;
    // "qi-condensation": +0.5% all hall income per purchase
    const qiCondensationCount = qrPurchases['qi-condensation'] ?? 0;
    if (qiCondensationCount > 0) {
      const qiCondConfig = QI_RESIDUE_SHOP_CONFIGS.find(
        (c) => c.id === 'qi-condensation',
      );
      if (qiCondConfig) {
        revenue = revenue.mul(
          1 + qiCondensationCount * qiCondConfig.valuePerPurchase,
        );
      }
    }

    // Active challenge income penalties.
    if (activeChallengeId === 10 || activeChallengeId === 12) {
      revenue = revenue.div(10);
    }

    // 11. Active challenge restrictions (income penalties)
    revenue = revenue.mul(get().challengeRestrictionMultiplier);
    return revenue;
  },

  getRevenueBreakdown: (id: number, config: HallConfigLookup) => {
    const hall = get().halls[id];
    if (!hall || hall.level <= 0) {
      const zero = D(0);
      const one = D(1);
      return {
        base: zero, hdp: one, mandate: one, daoPath: one, alchemy: one,
        disciple: one, legacy: one, challenge: one, spell: one, qr: one, total: zero,
      };
    }

    const base = config.baseRevenue.mul(hall.level).mul(hall.profitMultiplier);
    const hdp = D(usePrestigeStore.getState().getHDPMultiplier());
    const mandate = D(useMandateStore.getState().getMandateMultiplier(id));

    let daoPath = D(1);
    const activeDaoPath = useGameStore.getState().activeDaoPath;
    if (activeDaoPath !== null) {
      const pathId = parseInt(activeDaoPath, 10);
      if (!isNaN(pathId)) {
        const pathConfig = DAO_PATH_CONFIGS.find((p) => p.id === pathId);
        if (pathConfig && pathConfig.boostedHallIds.includes(id)) daoPath = D(pathConfig.hallMultiplier);
      }
    }

    const alchemy = D(useAlchemyStore.getState().getAlchemyMultiplier(id));
    let disciple = D(1);
    const assigned = useDiscipleStore.getState().roster.find((d) => d.assignedHallId === id && d.alive);
    if (assigned) {
      const dConfig = DISCIPLE_CONFIGS.find((c) => c.id === assigned.configId);
      if (dConfig) {
        const pullRate = PULL_RATES.find((pr) => pr.rarity === dConfig.rarity);
        const rarityMult = pullRate ? pullRate.rarityMultiplier : 1;
        const hallConfig = HALL_CONFIGS.find((h) => h.id === id);
        const elementMult = hallConfig && (hallConfig.matchingRoot === 'any' || hallConfig.matchingRoot === dConfig.root) ? 2 : 1;
        disciple = D(Math.min(rarityMult * elementMult, 5.0));
      }
    }

    const legacy = D(1 + Math.log10(1 + useGameStore.getState().legacyPower) * 0.5);
    let challenge = D(1);
    const challenges = useChallengeStore.getState().challenges;
    for (const challengeConfig of CHALLENGE_CONFIGS) {
      const slot = challenges[challengeConfig.id];
      if (!slot || !slot.completed) continue;
      if (challengeConfig.rewardType === 'allIncomeMult') challenge = challenge.mul(challengeConfig.rewardValue);
      if (challengeConfig.rewardType === 'hallProfitMult') {
        const hallTargetMap: Record<number, number[]> = { 1: [1], 7: [7] };
        const targetHalls = hallTargetMap[challengeConfig.id];
        if (targetHalls && targetHalls.includes(id)) challenge = challenge.mul(challengeConfig.rewardValue);
      }
    }

    const spellEffects = useDaoPathStore.getState().spellEffects;
    const spell = D(spellEffects.globalMultiplier).mul(spellEffects.hallMultipliers[id] ?? 1);

    let qr = D(1);
    const qiCondensationCount = useLegacyStore.getState().qrShopPurchases['qi-condensation'] ?? 0;
    if (qiCondensationCount > 0) {
      const qiCondConfig = QI_RESIDUE_SHOP_CONFIGS.find((c) => c.id === 'qi-condensation');
      if (qiCondConfig) qr = D(1 + qiCondensationCount * qiCondConfig.valuePerPurchase);
    }

    const restriction = get().challengeRestrictionMultiplier;
    const total = base.mul(hdp).mul(mandate).mul(daoPath).mul(alchemy).mul(disciple).mul(legacy).mul(challenge).mul(spell).mul(qr).mul(restriction);
    return { base, hdp, mandate, daoPath, alchemy, disciple, legacy, challenge: challenge.mul(restriction), spell, qr, total };
  },

  getTotalRevenuePerSecond: (hallConfigs: HallConfigLookup[]) => {
    const state = get();
    let total = D(0);

    for (const config of hallConfigs) {
      const hall = state.halls[config.id];
      if (!hall || !hall.isUnlocked || hall.level <= 0) continue;

      const revenuePerCycle = state.getRevenue(config.id, config);
      const cycleTime = config.cycleSeconds / hall.speedMultiplier.toNumber();
      if (cycleTime <= 0) continue;
      total = total.add(revenuePerCycle.div(cycleTime));
    }

    return total;
  },

  setBuyMode: (mode: BuyMode) => {
    set({ buyMode: mode });
  },

  startManualCycle: (id: number) => {
    set((state) => {
      const hall = state.halls[id];
      if (!hall || hall.level <= 0 || hall.isAutomated || hall.cycleProgress > 0) return state;
      return {
        halls: {
          ...state.halls,
          [id]: { ...hall, cycleProgress: 0.001 },
        },
      };
    });
  },

  setAutomated: (id: number, automated: boolean) => {
    set((state) => {
      const hall = state.halls[id];
      if (!hall) return state;
      return {
        halls: {
          ...state.halls,
          [id]: { ...hall, isAutomated: automated },
        },
      };
    });
  },

  setSpeedMultiplier: (id: number, mult: Decimal) => {
    set((state) => {
      const hall = state.halls[id];
      if (!hall) return state;
      return {
        halls: {
          ...state.halls,
          [id]: { ...hall, speedMultiplier: mult },
        },
      };
    });
  },

  setProfitMultiplier: (id: number, mult: Decimal) => {
    set((state) => {
      const hall = state.halls[id];
      if (!hall) return state;
      return {
        halls: {
          ...state.halls,
          [id]: { ...hall, profitMultiplier: mult },
        },
      };
    });
  },

  setChallengeRestrictionMultiplier: (mult: Decimal) => {
    set({ challengeRestrictionMultiplier: mult });
  },

  resetForAscension: () => {
    set((state) => {
      const newHalls: Record<number, HallSlot> = {};
      for (const [idStr] of Object.entries(state.halls)) {
        const id = Number(idStr);
        newHalls[id] = {
          ...createDefaultHall(),
          isUnlocked: id === 1, // Only hall 1 stays unlocked
        };
      }
      return { halls: newHalls };
    });
  },
}));
