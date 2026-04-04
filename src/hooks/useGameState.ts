import { useState, useCallback } from 'react';
import type { GameState, Sect, Season } from '@/types/game';
import { CultivationRealm, BuildingType } from '@/types/game';

function createInitialState(): GameState {
  const sect: Sect = {
    name: 'Immortal Sect',
    reputation: 10,
    spiritStones: 100,
    disciples: [
      {
        id: 'elder-1',
        name: 'Elder Chen',
        realm: CultivationRealm.CoreFormation,
        qi: 800,
        maxQi: 1000,
        talent: 7,
        loyalty: 90,
        traits: ['Wise', 'Patient'],
      },
      {
        id: 'disciple-1',
        name: 'Li Wei',
        realm: CultivationRealm.QiCondensation,
        qi: 100,
        maxQi: 200,
        talent: 8,
        loyalty: 75,
        traits: ['Ambitious'],
      },
    ],
    buildings: [
      {
        id: 'hall-1',
        name: 'Main Cultivation Hall',
        type: BuildingType.CultivationHall,
        level: 1,
        capacity: 10,
      },
    ],
    techniques: [],
  };

  return {
    sect,
    turn: 1,
    season: 'Spring' as Season,
    year: 1,
    events: [],
  };
}

export function useGameState() {
  const [state, setState] = useState<GameState>(createInitialState);

  const advanceTurn = useCallback(() => {
    setState((prev) => {
      const seasons: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter'] as Season[];
      const currentIdx = seasons.indexOf(prev.season);
      const nextIdx = (currentIdx + 1) % 4;
      const yearAdvance = nextIdx === 0 ? 1 : 0;

      return {
        ...prev,
        turn: prev.turn + 1,
        season: seasons[nextIdx],
        year: prev.year + yearAdvance,
      };
    });
  }, []);

  const updateSect = useCallback((updates: Partial<Sect>) => {
    setState((prev) => ({
      ...prev,
      sect: { ...prev.sect, ...updates },
    }));
  }, []);

  return { state, advanceTurn, updateSect };
}
