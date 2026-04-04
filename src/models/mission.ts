/** Mission types for daily sect missions */
export type MissionType =
  | 'buyHallLevels'
  | 'hireElders'
  | 'craftPills'
  | 'completePush'
  | 'pullDisciples'
  | 'ascend'
  | 'meditate'
  | 'collectTreasure';

/** Static configuration for a daily mission */
export interface MissionConfig {
  id: string;
  name: string;
  description: string;
  type: MissionType;
  target: number;
  rtReward: number;
  aeReward: number;
}

/** Runtime state for a single mission instance */
export interface MissionInstance {
  configId: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

/** Daily mission board state */
export interface MissionBoardState {
  missions: MissionInstance[];
  lastRefreshDate: string;
  dailyCheckInClaimed: boolean;
}
