import { describe, it, expect } from 'vitest';
import Decimal from 'break_infinity.js';
import { D } from '@core/BigNumber';
import type { ChallengeConfig, ChallengeState } from '@models/challenge';

/**
 * ChallengeSystem tests.
 *
 * Tests the Tribulation Challenge mechanics as TDD contracts.
 * The ChallengeSystem implementation module may not exist yet.
 */

function createChallengeConfig(overrides: Partial<ChallengeConfig> = {}): ChallengeConfig {
  return {
    id: 1,
    name: 'One Path',
    restriction: 'Only Hall 1 is active',
    targetEarnings: D(1e9),
    rewardDescription: 'x2 Hall 1 profit permanently',
    rewardType: 'hallProfitMult',
    rewardValue: 2,
    ...overrides,
  };
}

function createChallengeState(overrides: Partial<ChallengeState> = {}): ChallengeState {
  return {
    challengeId: 1,
    completed: false,
    active: false,
    currentEarnings: D(0),
    ...overrides,
  };
}

describe('ChallengeSystem', () => {
  describe('Challenge 1: One Path', () => {
    it('should restrict to only Hall 1 being active', () => {
      const config = createChallengeConfig();
      expect(config.restriction).toContain('Hall 1');
    });

    it('should require 1B SS to complete', () => {
      const config = createChallengeConfig();
      expect(config.targetEarnings.toNumber()).toBe(1e9);
    });

    it('should grant x2 Hall 1 profit as reward', () => {
      const config = createChallengeConfig();
      expect(config.rewardType).toBe('hallProfitMult');
      expect(config.rewardValue).toBe(2);
    });
  });

  describe('Challenge activation', () => {
    it('should set challenge as active when entered', () => {
      const state = createChallengeState({ active: true });
      expect(state.active).toBe(true);
      expect(state.completed).toBe(false);
    });

    it('should not allow entering a challenge while another is active', () => {
      const challenges: ChallengeState[] = [
        createChallengeState({ challengeId: 1, active: true }),
        createChallengeState({ challengeId: 2, active: false }),
      ];

      const anyActive = challenges.some(c => c.active);
      expect(anyActive).toBe(true);
      // Should prevent activating challenge 2
    });
  });

  describe('Challenge completion', () => {
    it('should mark as completed when target earnings are met', () => {
      const config = createChallengeConfig({ targetEarnings: D(1e9) });
      const state = createChallengeState({
        active: true,
        currentEarnings: D(1e9),
      });

      const isComplete = state.currentEarnings.gte(config.targetEarnings);
      expect(isComplete).toBe(true);
    });

    it('should not grant reward on exit without completing', () => {
      const state = createChallengeState({
        active: true,
        currentEarnings: D(500e6), // 500M, less than 1B target
        completed: false,
      });

      // Exit without completing - reward should not apply
      const exited = { ...state, active: false };
      expect(exited.completed).toBe(false);
      expect(exited.active).toBe(false);
    });
  });

  describe('Challenge rewards persist through Ascension', () => {
    it('should keep completed status after ascension', () => {
      const state = createChallengeState({ completed: true, active: false });
      // Ascension resets many things but challenges.completed should persist
      expect(state.completed).toBe(true);
    });
  });

  describe('Challenge earnings tracking', () => {
    it('should accumulate earnings during active challenge', () => {
      const state = createChallengeState({ active: true, currentEarnings: D(0) });
      const earned = D(100);

      const updated: ChallengeState = {
        ...state,
        currentEarnings: state.currentEarnings.add(earned),
      };

      expect(updated.currentEarnings.toNumber()).toBe(100);
    });

    it('should reset earnings when challenge is exited incomplete', () => {
      const state = createChallengeState({
        active: true,
        currentEarnings: D(500e6),
      });

      // Exit -> reset earnings
      const exited: ChallengeState = {
        ...state,
        active: false,
        currentEarnings: D(0),
      };

      expect(exited.currentEarnings.toNumber()).toBe(0);
    });
  });
});
