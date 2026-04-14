import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { SectMountain } from '@components/SectMountain';
import { useGameStore } from '@state/gameStore';
import { useHallStore } from '@state/hallStore';
import { HALL_CONFIGS } from '@data/hallConfigs';

function resetStores() {
  useGameStore.getState().reset();
  useHallStore.setState({ halls: {}, buyMode: 1 });
  const hs = useHallStore.getState();
  for (const config of HALL_CONFIGS) hs.initHall(config.id);
  hs.unlockHall(1);
}

describe('SectMountain click-to-click flow', () => {
  beforeEach(() => {
    resetStores();
  });

  it('meditate click increases spirit stones', () => {
    render(<SectMountain />);

    const before = useGameStore.getState().spiritStones.toNumber();
    fireEvent.click(screen.getByRole('button', { name: /meditate/i }));
    const after = useGameStore.getState().spiritStones.toNumber();

    expect(after).toBeGreaterThan(before);
  });

  it('buy x1 on Hall 1 spends stones and increases level', () => {
    render(<SectMountain />);

    // Build enough SS manually to guarantee affordability
    useGameStore.getState().addSpiritStones(HALL_CONFIGS[0].baseCost.mul(5));

    const hallName = /Qi Gathering Pavilion/i;
    const cardHeading = screen.getByRole('heading', { name: hallName });
    const card = cardHeading.closest('.hall-card');
    expect(card).toBeTruthy();
    const buyBtn = within(card as HTMLElement).getByRole('button', { name: /buy x1/i });

    const beforeLevel = useHallStore.getState().halls[1].level;
    const beforeSS = useGameStore.getState().spiritStones.toNumber();

    fireEvent.click(buyBtn);

    const afterLevel = useHallStore.getState().halls[1].level;
    const afterSS = useGameStore.getState().spiritStones.toNumber();

    expect(afterLevel).toBeGreaterThan(beforeLevel);
    expect(afterSS).toBeLessThan(beforeSS);
  });
});
