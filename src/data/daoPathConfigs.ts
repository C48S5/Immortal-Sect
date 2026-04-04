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
      activeDuration: 30,
      cooldown: 300,
      effectDescription:
        'For 30s, every 3s a random hall receives x1-x10 income (avg x3.75). 300s cooldown.',
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
      activeDuration: 120,
      cooldown: 600,
      effectDescription:
        'Lock 1 hall for 120s. Income ramps x0.5 to x2 over duration (avg x1.22, x2 if held full). 600s cooldown.',
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
      cooldown: 180,
      effectDescription:
        '50% chance: x10 all income for 10s. 50% chance: x0 for 5s then x5 for 5s. 180s cooldown.',
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
