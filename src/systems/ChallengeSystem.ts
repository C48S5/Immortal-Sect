/**
 * ChallengeSystem — 12 Tribulation Challenges.
 *
 * Each challenge imposes restrictions and requires earning a target amount of SS.
 * Rewards are PERMANENT multipliers that persist through Ascension and everything.
 *
 * Restrictions include: disable halls, no elders, slower cycles, no alchemy,
 * reduced income, etc.
 */
import Decimal from 'break_infinity.js';
import { D } from '@core/BigNumber';
import type { ChallengeConfig, ChallengeState, ChallengeRewardType } from '@models/challenge';
import { CHALLENGE_CONFIGS } from '@data/challengeConfigs';

/** Get a challenge config by ID. */
export function getChallengeConfig(id: number): ChallengeConfig | undefined {
  return CHALLENGE_CONFIGS.find(c => c.id === id);
}

/** Get all challenge configs. */
export function getAllChallengeConfigs(): readonly ChallengeConfig[] {
  return CHALLENGE_CONFIGS;
}

/**
 * Enter a challenge. Returns the initial ChallengeState for the active challenge.
 * The store should also trigger an Ascension-like reset when entering.
 */
export function enterChallenge(
  challengeId: number,
  currentChallenges: ChallengeState[],
): { newState: ChallengeState; canEnter: boolean; message: string } {
  const config = getChallengeConfig(challengeId);
  if (!config) {
    return { newState: createDefaultState(challengeId), canEnter: false, message: 'Challenge not found.' };
  }

  // Check if already completed
  const existing = currentChallenges.find(c => c.challengeId === challengeId);
  if (existing?.completed) {
    return { newState: existing, canEnter: false, message: 'Challenge already completed.' };
  }

  // Check if another challenge is active
  const active = currentChallenges.find(c => c.active);
  if (active) {
    return {
      newState: createDefaultState(challengeId),
      canEnter: false,
      message: `Already in challenge: ${getChallengeConfig(active.challengeId)?.name ?? 'Unknown'}.`,
    };
  }

  return {
    newState: {
      challengeId,
      completed: false,
      active: true,
      currentEarnings: D(0),
    },
    canEnter: true,
    message: `Entered ${config.name}: ${config.restriction}`,
  };
}

/**
 * Exit a challenge. Awards reward if target was met.
 */
export function exitChallenge(
  challengeState: ChallengeState,
): { updatedState: ChallengeState; rewardEarned: boolean; message: string } {
  const config = getChallengeConfig(challengeState.challengeId);
  if (!config) {
    return {
      updatedState: { ...challengeState, active: false },
      rewardEarned: false,
      message: 'Challenge not found.',
    };
  }

  const targetMet = challengeState.currentEarnings.gte(config.targetEarnings);

  return {
    updatedState: {
      ...challengeState,
      active: false,
      completed: targetMet || challengeState.completed,
      currentEarnings: D(0),
    },
    rewardEarned: targetMet && !challengeState.completed,
    message: targetMet
      ? `${config.name} completed! Reward: ${config.rewardDescription}`
      : `Exited ${config.name} without meeting target.`,
  };
}

/**
 * Update challenge earnings when SS are earned during an active challenge.
 */
export function addChallengeEarnings(
  state: ChallengeState,
  earned: Decimal,
): ChallengeState {
  if (!state.active) return state;
  return {
    ...state,
    currentEarnings: state.currentEarnings.add(earned),
  };
}

/**
 * Check if a specific restriction is currently active.
 * Used by other systems to check if they should apply challenge debuffs.
 */
export function isRestrictionActive(
  restriction: string,
  challenges: ChallengeState[],
): boolean {
  const active = challenges.find(c => c.active);
  if (!active) return false;

  const config = getChallengeConfig(active.challengeId);
  if (!config) return false;

  // Final Tribulation (12) combines 1-4
  if (config.id === 12) {
    const combined = [1, 2, 3, 4].map(id => getChallengeConfig(id)?.restriction ?? '');
    return combined.some(r => r.toLowerCase().includes(restriction.toLowerCase()))
      || config.restriction.toLowerCase().includes(restriction.toLowerCase());
  }

  return config.restriction.toLowerCase().includes(restriction.toLowerCase());
}

/**
 * Get the active challenge if any.
 */
export function getActiveChallenge(
  challenges: ChallengeState[],
): { state: ChallengeState; config: ChallengeConfig } | null {
  const active = challenges.find(c => c.active);
  if (!active) return null;

  const config = getChallengeConfig(active.challengeId);
  if (!config) return null;

  return { state: active, config };
}

/**
 * Get the combined reward multiplier for a specific reward type
 * from all completed challenges.
 */
export function getChallengeRewardMultiplier(
  rewardType: ChallengeRewardType,
  challenges: ChallengeState[],
): number {
  let mult = 1;

  for (const cs of challenges) {
    if (!cs.completed) continue;
    const config = getChallengeConfig(cs.challengeId);
    if (!config || config.rewardType !== rewardType) continue;
    mult *= config.rewardValue;
  }

  return mult;
}

/**
 * Check which halls are disabled by the active challenge.
 */
export function getDisabledHalls(challenges: ChallengeState[]): number[] {
  const active = challenges.find(c => c.active);
  if (!active) return [];

  const config = getChallengeConfig(active.challengeId);
  if (!config) return [];

  const disabled: number[] = [];

  // "Only Hall 1 available" — disable 2-12
  if (config.id === 1 || config.id === 12) {
    for (let i = 2; i <= 12; i++) disabled.push(i);
  }

  // "Halls 7-12 disabled"
  if (config.id === 6) {
    for (let i = 7; i <= 12; i++) disabled.push(i);
  }

  // "Hall 3 and Hall 5 disabled"
  if (config.id === 10) {
    disabled.push(3, 5);
  }

  return disabled;
}

/**
 * Check if the level cap restriction is active and return the cap.
 */
export function getLevelCap(challenges: ChallengeState[]): number | null {
  const active = challenges.find(c => c.active);
  if (!active) return null;

  const config = getChallengeConfig(active.challengeId);
  if (!config) return null;

  // "Cannot buy past level 100"
  if (config.id === 9) return 100;

  return null;
}

function createDefaultState(challengeId: number): ChallengeState {
  return {
    challengeId,
    completed: false,
    active: false,
    currentEarnings: D(0),
  };
}
