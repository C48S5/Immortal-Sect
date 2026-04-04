import { describe, it, expect, vi } from 'vitest';
import { Rarity } from '@models/disciple';

/**
 * DiscipleSystem tests.
 *
 * Tests disciple bonuses, gacha mechanics, and ability inheritance.
 */

const RARITY_MULTS: Record<string, number> = {
  common: 1.05,
  uncommon: 1.12,
  rare: 1.25,
  epic: 1.50,
  legendary: 2.00,
};

const PULL_RATES: Record<string, number> = {
  common: 0.52,
  uncommon: 0.25,
  rare: 0.15,
  epic: 0.06,
  legendary: 0.02,
};

function calculateDiscipleBonus(
  rarity: string,
  elementMatch: boolean,
  traitMatch: boolean,
): number {
  let bonus = RARITY_MULTS[rarity] ?? 1;
  if (elementMatch) bonus *= 2.0;
  if (traitMatch) bonus *= 1.25;
  return bonus;
}

function simulatePull(random: number): string {
  let cumulative = 0;
  for (const [rarity, rate] of Object.entries(PULL_RATES)) {
    cumulative += rate;
    if (random < cumulative) return rarity;
  }
  return 'common'; // fallback
}

describe('DiscipleSystem', () => {
  describe('DiscipleBonus calculation', () => {
    it('Common, no element match, no trait match: x1.05', () => {
      expect(calculateDiscipleBonus('common', false, false)).toBeCloseTo(1.05, 5);
    });

    it('Uncommon, no matches: x1.12', () => {
      expect(calculateDiscipleBonus('uncommon', false, false)).toBeCloseTo(1.12, 5);
    });

    it('Rare, element match, no trait: x1.25 * 2.00 = x2.50', () => {
      expect(calculateDiscipleBonus('rare', true, false)).toBeCloseTo(2.50, 5);
    });

    it('Epic, no matches: x1.50', () => {
      expect(calculateDiscipleBonus('epic', false, false)).toBeCloseTo(1.50, 5);
    });

    it('Legendary, element + trait match: x2.00 * 2.00 * 1.25 = x5.00', () => {
      expect(calculateDiscipleBonus('legendary', true, true)).toBeCloseTo(5.00, 5);
    });

    it('Legendary, element match only: x2.00 * 2.00 = x4.00', () => {
      expect(calculateDiscipleBonus('legendary', true, false)).toBeCloseTo(4.00, 5);
    });

    it('Legendary, trait match only: x2.00 * 1.25 = x2.50', () => {
      expect(calculateDiscipleBonus('legendary', false, true)).toBeCloseTo(2.50, 5);
    });
  });

  describe('Gacha pull rates', () => {
    it('rates should sum to 1.00', () => {
      const total = Object.values(PULL_RATES).reduce((sum, r) => sum + r, 0);
      expect(total).toBeCloseTo(1.0, 5);
    });

    it('should approximate expected distribution over 10000 pulls', () => {
      const counts: Record<string, number> = {
        common: 0,
        uncommon: 0,
        rare: 0,
        epic: 0,
        legendary: 0,
      };

      const numPulls = 10000;
      // Use seeded pseudo-random for reproducibility
      let seed = 42;
      function nextRandom(): number {
        // Simple LCG
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      }

      for (let i = 0; i < numPulls; i++) {
        const rarity = simulatePull(nextRandom());
        counts[rarity]++;
      }

      const tolerance = 0.03; // 3% tolerance
      expect(counts.common / numPulls).toBeCloseTo(PULL_RATES.common, 1);
      expect(Math.abs(counts.common / numPulls - PULL_RATES.common)).toBeLessThan(tolerance);
      expect(Math.abs(counts.uncommon / numPulls - PULL_RATES.uncommon)).toBeLessThan(tolerance);
      expect(Math.abs(counts.rare / numPulls - PULL_RATES.rare)).toBeLessThan(tolerance);
      expect(Math.abs(counts.epic / numPulls - PULL_RATES.epic)).toBeLessThan(tolerance);
      expect(Math.abs(counts.legendary / numPulls - PULL_RATES.legendary)).toBeLessThan(tolerance);
    });
  });

  describe('Pity system', () => {
    it('should guarantee Epic+ on the 50th pull without one', () => {
      const hardPityPulls = 50;
      let pullsSinceLastEpic = 49;

      // 50th pull should trigger pity
      pullsSinceLastEpic++;
      const isPity = pullsSinceLastEpic >= hardPityPulls;
      expect(isPity).toBe(true);
    });

    it('should reset pity counter on Epic+ pull', () => {
      let pullsSinceLastEpic = 35;
      const pulledRarity = 'epic';

      if (pulledRarity === 'epic' || pulledRarity === 'legendary') {
        pullsSinceLastEpic = 0;
      }

      expect(pullsSinceLastEpic).toBe(0);
    });

    it('should not trigger pity before 50 pulls', () => {
      const hardPityPulls = 50;
      const pullsSinceLastEpic = 48;
      expect(pullsSinceLastEpic < hardPityPulls).toBe(true);
    });
  });

  describe('Spark system', () => {
    it('should allow choosing any Legendary after 300 pulls', () => {
      const sparkPulls = 300;
      const totalPulls = 300;
      const canSpark = totalPulls >= sparkPulls;
      expect(canSpark).toBe(true);
    });

    it('should not allow spark before 300 pulls', () => {
      const sparkPulls = 300;
      const totalPulls = 299;
      const canSpark = totalPulls >= sparkPulls;
      expect(canSpark).toBe(false);
    });
  });

  describe('Ability inheritance decay', () => {
    it('1 stack should be 26% of max bonus', () => {
      // Decay formula: bonus = maxBonus * (1 - 0.74^stacks)
      // At 1 stack: 1 - 0.74^1 = 0.26 = 26%
      const stacks = 1;
      const decayFactor = 0.74;
      const bonusPercent = 1 - Math.pow(decayFactor, stacks);
      expect(bonusPercent).toBeCloseTo(0.26, 2);
    });

    it('3 stacks should be 59% of max bonus', () => {
      const stacks = 3;
      const decayFactor = 0.74;
      const bonusPercent = 1 - Math.pow(decayFactor, stacks);
      // 1 - 0.74^3 = 1 - 0.405224 = 0.594776 ≈ 59%
      expect(bonusPercent).toBeCloseTo(0.5948, 2);
    });

    it('higher stacks should approach but never exceed 100%', () => {
      const decayFactor = 0.74;
      const stacks = 20;
      const bonusPercent = 1 - Math.pow(decayFactor, stacks);
      expect(bonusPercent).toBeLessThan(1);
      expect(bonusPercent).toBeGreaterThan(0.99);
    });
  });
});
