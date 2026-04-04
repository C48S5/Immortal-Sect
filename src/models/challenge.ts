import Decimal from 'break_infinity.js';

/** Static configuration for a Tribulation Challenge */
export interface ChallengeConfig {
  /** Unique challenge identifier (1-12) */
  id: number;
  /** Challenge name */
  name: string;
  /** Description of the restriction */
  restriction: string;
  /** Target Spirit Stones to earn during the challenge */
  targetEarnings: Decimal;
  /** Permanent reward description */
  rewardDescription: string;
  /** Reward effect type for the game engine */
  rewardType: ChallengeRewardType;
  /** Reward multiplier or percentage value */
  rewardValue: number;
}

/** Types of challenge rewards */
export type ChallengeRewardType =
  | 'hallProfitMult'
  | 'elderCostReduction'
  | 'allSpeedMult'
  | 'aeGenerationMult'
  | 'allCostReduction'
  | 'treasureValueMult'
  | 'hdpGainMult'
  | 'offlineEarningsMult'
  | 'allIncomeMult'
  | 'milestonePowerMult';

/** Runtime state for a challenge */
export interface ChallengeState {
  /** Challenge config ID */
  challengeId: number;
  /** Whether the challenge has been completed */
  completed: boolean;
  /** Whether the challenge is currently active */
  active: boolean;
  /** Current earnings during an active challenge */
  currentEarnings: Decimal;
}
