import { describe, it, expect } from 'vitest';
import Decimal from 'break_infinity.js';
import { D } from '@core/BigNumber';
import {
  calculateRevenue,
  calculateRevenuePerSecond,
  calculateTotalRevenuePerSecond,
  getRevenueBreakdown,
} from '@systems/RevenueCalculator';
import type { GameStateSnapshot, HallState, HallConfig } from '@systems/types';

/** Create a minimal GameStateSnapshot for testing */
function createMinimalState(overrides: Partial<GameStateSnapshot> = {}): GameStateSnapshot {
  const hallConfigs: HallConfig[] = [
    {
      id: 1,
      name: 'Qi Gathering Pavilion',
      baseCost: D(4),
      coefficient: 1.07,
      cycleSeconds: 1,
      baseRevenue: D(0.08),
      element: 'neutral',
      matchingRoot: 'any',
      description: '',
    },
  ];

  const halls: HallState[] = [
    {
      hallId: 1,
      level: 1,
      unlocked: true,
      cycleProgress: 0,
      isRunning: false,
      milestoneSpeedMult: 1,
      milestoneProfitMult: 1,
      assignedDiscipleId: null,
      assignedElderId: null,
    },
  ];

  return {
    currencies: {
      spiritStones: D(0),
      hdp: 0,
      daoCrystals: 0,
      heavenlySeals: 0,
      alchemyEssence: D(0),
      recruitmentTokens: 0,
      qiResidue: 0,
    },
    halls,
    hallConfigs,
    elders: [],
    elderConfigs: [],
    disciples: [],
    discipleConfigs: [],
    daoPath: { selectedPathId: null, spellActive: false, spellRemainingDuration: 0, spellCooldownRemaining: 0 },
    daoPathConfigs: [],
    challenges: [],
    challengeConfigs: [],
    alchemy: { activeBuffs: [], alchemyEssence: D(0), baseAePerSecond: 0, bonusAePerSecond: 0 },
    alchemyConfigs: [],
    mandates: [],
    automation: [],
    dungeonRealms: [],
    legacy: { legacyPower: 0, fragments: [], qiResidueBuffsPurchased: {} },
    gachaConfig: { singlePullCost: 1, tenPullCost: 9, hardPityPulls: 50, sparkPulls: 300, pullRates: [] },
    totalPulls: 0,
    pullsSinceLastEpic: 0,
    spellState: { hallMultipliers: {}, globalMultiplier: 1, aeMultiplier: 1, treasureRateMultiplier: 1 },
    totalEarnings: D(0),
    ascensionCount: 0,
    hdpSpent: 0,
    now: Date.now(),
    ...overrides,
  };
}

describe('RevenueCalculator', () => {
  describe('calculateRevenue (per cycle)', () => {
    it('should return baseRevenue * level for Hall 1, level 1, no multipliers', () => {
      const state = createMinimalState();
      const revenue = calculateRevenue(1, state);
      // 0.08 * 1 * 1 (milestone) * 1 (HDP) * ... = 0.08
      expect(revenue.toNumber()).toBeCloseTo(0.08, 5);
    });

    it('should scale linearly with level', () => {
      const state = createMinimalState();
      state.halls[0].level = 10;
      const revenue = calculateRevenue(1, state);
      // 0.08 * 10 = 0.8
      expect(revenue.toNumber()).toBeCloseTo(0.8, 5);
    });

    it('should apply milestone profit multiplier', () => {
      const state = createMinimalState();
      state.halls[0].level = 100;
      state.halls[0].milestoneProfitMult = 2;
      const revenue = calculateRevenue(1, state);
      // 0.08 * 100 * 2 = 16
      expect(revenue.toNumber()).toBeCloseTo(16, 3);
    });

    it('should apply HDP multiplier with 100 HDP, 0 spent', () => {
      const state = createMinimalState();
      state.currencies.hdp = 100;
      state.hdpSpent = 0;
      state.halls[0].level = 1;
      const revenue = calculateRevenue(1, state);
      // HDP mult = 1 + 100 * 0.02 = 3
      // 0.08 * 1 * 1 * 3 = 0.24
      expect(revenue.toNumber()).toBeCloseTo(0.24, 5);
    });

    it('should apply Dao Path multiplier for boosted halls', () => {
      const state = createMinimalState({
        daoPath: { selectedPathId: 1, spellActive: false, spellRemainingDuration: 0, spellCooldownRemaining: 0 },
        daoPathConfigs: [
          {
            id: 1,
            name: 'Sword Dao',
            boostedHallIds: [1, 7],
            hallMultiplier: 3,
            passiveDescription: '',
            passiveValue: 0,
            spell: { name: 'Sword Storm', activeDuration: 30, cooldown: 300, effectDescription: '' },
          },
        ],
      });
      state.halls[0].level = 1;
      const revenue = calculateRevenue(1, state);
      // 0.08 * 1 * 1 * 1 * 3 (dao) = 0.24
      expect(revenue.toNumber()).toBeCloseTo(0.24, 5);
    });

    it('should apply alchemy buff multiplier', () => {
      const state = createMinimalState({
        alchemy: {
          activeBuffs: [
            { itemId: 1, remainingSeconds: 30, multiplier: 2, affectedHallIds: [1, 2, 3] },
          ],
          alchemyEssence: D(0),
          baseAePerSecond: 0,
          bonusAePerSecond: 0,
        },
      });
      state.halls[0].level = 1;
      const revenue = calculateRevenue(1, state);
      // 0.08 * 1 * 1 * 1 * 1 * 1 * 2 (alchemy) = 0.16
      expect(revenue.toNumber()).toBeCloseTo(0.16, 5);
    });

    it('should stack all multipliers multiplicatively', () => {
      const state = createMinimalState({
        daoPath: { selectedPathId: 1, spellActive: false, spellRemainingDuration: 0, spellCooldownRemaining: 0 },
        daoPathConfigs: [
          {
            id: 1, name: 'Sword Dao', boostedHallIds: [1, 7], hallMultiplier: 3,
            passiveDescription: '', passiveValue: 0,
            spell: { name: '', activeDuration: 0, cooldown: 0, effectDescription: '' },
          },
        ],
        alchemy: {
          activeBuffs: [
            { itemId: 1, remainingSeconds: 30, multiplier: 2, affectedHallIds: [1] },
          ],
          alchemyEssence: D(0),
          baseAePerSecond: 0,
          bonusAePerSecond: 0,
        },
      });
      state.currencies.hdp = 100;
      state.hdpSpent = 0;
      state.halls[0].level = 100;
      state.halls[0].milestoneProfitMult = 8;

      const revenue = calculateRevenue(1, state);
      // base * level * milestonePM * HDP * dao * alchemy
      // 0.08 * 100 * 8 * 3 * 3 * 2 = 1152
      expect(revenue.toNumber()).toBeCloseTo(1152, 0);
    });

    it('should return 0 for unlocked hall at level 0', () => {
      const state = createMinimalState();
      state.halls[0].level = 0;
      expect(calculateRevenue(1, state).toNumber()).toBe(0);
    });

    it('should return 0 for locked hall', () => {
      const state = createMinimalState();
      state.halls[0].unlocked = false;
      expect(calculateRevenue(1, state).toNumber()).toBe(0);
    });
  });

  describe('calculateRevenuePerSecond', () => {
    it('should equal revenue / cycleSeconds for Hall 1 at level 1', () => {
      const state = createMinimalState();
      const rps = calculateRevenuePerSecond(1, state);
      // 0.08 / 1 = 0.08 SS/s
      expect(rps.toNumber()).toBeCloseTo(0.08, 5);
    });

    it('should account for milestone speed multiplier in effective cycle time', () => {
      const state = createMinimalState();
      state.halls[0].level = 100;
      state.halls[0].milestoneSpeedMult = 8;
      state.halls[0].milestoneProfitMult = 1;

      const rps = calculateRevenuePerSecond(1, state);
      // Revenue per cycle = 0.08 * 100 * 1 = 8
      // Effective cycle = 1 / 8 = 0.125s
      // RPS = 8 / 0.125 = 64
      expect(rps.toNumber()).toBeCloseTo(64, 1);
    });
  });

  describe('calculateTotalRevenuePerSecond', () => {
    it('should sum revenue across all active halls', () => {
      const state = createMinimalState();
      // Add a second hall
      state.hallConfigs.push({
        id: 2,
        name: 'Body Tempering Dojo',
        baseCost: D(26),
        coefficient: 1.15,
        cycleSeconds: 3,
        baseRevenue: D(0.49),
        element: 'earth',
        matchingRoot: 'earth',
        description: '',
      });
      state.halls.push({
        hallId: 2,
        level: 1,
        unlocked: true,
        cycleProgress: 0,
        isRunning: false,
        milestoneSpeedMult: 1,
        milestoneProfitMult: 1,
        assignedDiscipleId: null,
        assignedElderId: null,
      });

      const total = calculateTotalRevenuePerSecond(state);
      // Hall 1: 0.08/1 = 0.08, Hall 2: 0.49/3 = 0.1633...
      expect(total.toNumber()).toBeCloseTo(0.08 + 0.49 / 3, 3);
    });
  });

  describe('getRevenueBreakdown', () => {
    it('should return a complete breakdown', () => {
      const state = createMinimalState();
      state.halls[0].level = 10;

      const breakdown = getRevenueBreakdown(1, state);
      expect(breakdown).not.toBeNull();
      expect(breakdown!.hallId).toBe(1);
      expect(breakdown!.baseRevenue.toNumber()).toBeCloseTo(0.08, 5);
      expect(breakdown!.unitsOwned).toBe(10);
      expect(breakdown!.cycleSeconds).toBe(1);
      expect(breakdown!.perSecond.toNumber()).toBeGreaterThan(0);
    });

    it('should return null for nonexistent hall', () => {
      const state = createMinimalState();
      expect(getRevenueBreakdown(99, state)).toBeNull();
    });
  });

  describe('Legacy multiplier integration', () => {
    it('should apply legacy power multiplier: LP=10 -> x1.52', () => {
      const state = createMinimalState();
      state.legacy.legacyPower = 10;
      state.halls[0].level = 1;

      const revenue = calculateRevenue(1, state);
      // 1 + log10(11) * 0.5 = 1 + 1.0414 * 0.5 = 1.5207
      const expectedMult = 1 + Math.log10(11) * 0.5;
      expect(revenue.toNumber()).toBeCloseTo(0.08 * expectedMult, 4);
    });

    it('should apply legacy power multiplier: LP=100 -> x2.00', () => {
      const state = createMinimalState();
      state.legacy.legacyPower = 100;
      state.halls[0].level = 1;

      const revenue = calculateRevenue(1, state);
      const expectedMult = 1 + Math.log10(101) * 0.5;
      expect(revenue.toNumber()).toBeCloseTo(0.08 * expectedMult, 4);
    });
  });
});
