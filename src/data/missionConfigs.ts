import type { MissionConfig } from '../models/mission';

/** Pool of possible daily missions. 3 are randomly chosen each day. */
export const MISSION_POOL: readonly MissionConfig[] = [
  {
    id: 'buy-levels-50',
    name: 'Diligent Builder',
    description: 'Buy 50 hall levels',
    type: 'buyHallLevels',
    target: 50,
    rtReward: 100,
    aeReward: 0,
  },
  {
    id: 'buy-levels-200',
    name: 'Grand Architect',
    description: 'Buy 200 hall levels',
    type: 'buyHallLevels',
    target: 200,
    rtReward: 200,
    aeReward: 10,
  },
  {
    id: 'craft-pills-3',
    name: 'Pill Refiner',
    description: 'Craft 3 pills',
    type: 'craftPills',
    target: 3,
    rtReward: 100,
    aeReward: 0,
  },
  {
    id: 'craft-pills-8',
    name: 'Master Alchemist',
    description: 'Craft 8 pills',
    type: 'craftPills',
    target: 8,
    rtReward: 150,
    aeReward: 15,
  },
  {
    id: 'push-3',
    name: 'Realm Explorer',
    description: 'Complete 3 push floors',
    type: 'completePush',
    target: 3,
    rtReward: 150,
    aeReward: 10,
  },
  {
    id: 'push-10',
    name: 'Dungeon Conqueror',
    description: 'Complete 10 push floors',
    type: 'completePush',
    target: 10,
    rtReward: 250,
    aeReward: 25,
  },
  {
    id: 'pull-5',
    name: 'Gate Opener',
    description: 'Summon 5 disciples',
    type: 'pullDisciples',
    target: 5,
    rtReward: 100,
    aeReward: 0,
  },
  {
    id: 'meditate-20',
    name: 'Inner Peace',
    description: 'Meditate 20 times',
    type: 'meditate',
    target: 20,
    rtReward: 80,
    aeReward: 5,
  },
  {
    id: 'meditate-100',
    name: 'Dao Seeker',
    description: 'Meditate 100 times',
    type: 'meditate',
    target: 100,
    rtReward: 200,
    aeReward: 15,
  },
  {
    id: 'treasure-3',
    name: 'Fortune Finder',
    description: 'Collect 3 Heavenly Treasures',
    type: 'collectTreasure',
    target: 3,
    rtReward: 120,
    aeReward: 10,
  },
  {
    id: 'ascend-1',
    name: 'Transcendence',
    description: 'Perform 1 Ascension',
    type: 'ascend',
    target: 1,
    rtReward: 300,
    aeReward: 50,
  },
];

/** Daily check-in RT reward */
export const DAILY_CHECK_IN_RT = 300;

/** Number of missions selected per day */
export const DAILY_MISSION_COUNT = 3;
