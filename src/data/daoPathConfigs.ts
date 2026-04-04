import type { DaoPathConfig } from '../models/daoPath';

/** All 5 Dao Path configurations */
export const DAO_PATH_CONFIGS: readonly DaoPathConfig[] = [
  {
    id: 1,
    name: 'Sword Dao',
    boostedHallIds: [1, 7],
    hallMultiplier: 3,
    passiveDescription: '+10% crit chance on Heavenly Treasures',
    passiveValue: 0.10,
    spell: {
      name: 'Sword Storm',
      activeDuration: 45,
      cooldown: 180,
      effectDescription:
        'For 45s, every 3s a random hall receives x3-x10 income (avg x5.5). 180s cooldown.',
    },
  },
  {
    id: 2,
    name: 'Alchemy Dao',
    boostedHallIds: [3, 5],
    hallMultiplier: 3,
    passiveDescription: '-20% alchemy crafting time',
    passiveValue: 0.20,
    spell: {
      name: 'Golden Core Overflow',
      activeDuration: 60,
      cooldown: 240,
      effectDescription:
        'For 60s, AE generation is tripled (x3). 240s cooldown.',
    },
  },
  {
    id: 3,
    name: 'Formation Dao',
    boostedHallIds: [4, 6],
    hallMultiplier: 3,
    passiveDescription: '-5% all hall costs',
    passiveValue: 0.05,
    spell: {
      name: 'Barrier Seal',
      activeDuration: 90,
      cooldown: 300,
      effectDescription:
        'Lock 1 hall for 90s. Income ramps x1 to x4 over duration (avg x2.5, x4 if held full). 300s cooldown.',
    },
  },
  {
    id: 4,
    name: 'Body Dao',
    boostedHallIds: [2, 8],
    hallMultiplier: 3,
    passiveDescription: '+25% offline earnings',
    passiveValue: 0.25,
    spell: {
      name: 'Heavenly Tribulation',
      activeDuration: 10,
      cooldown: 300,
      effectDescription:
        '50% chance: x10 all income for 10s. 50% chance: x0 for 5s then x5 for 5s. 300s cooldown.',
    },
  },
  {
    id: 5,
    name: 'Spirit Dao',
    boostedHallIds: [9, 10, 11],
    hallMultiplier: 2.5,
    passiveDescription: '+1 Heavenly Treasure per minute',
    passiveValue: 1,
    spell: {
      name: 'Beast Stampede',
      activeDuration: 45,
      cooldown: 360,
      effectDescription:
        'For 45s, Heavenly Treasure spawn rate is x5. 360s cooldown.',
    },
  },
] as const;
