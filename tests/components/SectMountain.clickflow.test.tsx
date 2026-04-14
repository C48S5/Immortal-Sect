import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, act, waitFor } from '@testing-library/react';
import { SectMountain } from '@components/SectMountain';
import { useGameStore } from '@state/gameStore';
import { useHallStore } from '@state/hallStore';
import { HALL_CONFIGS } from '@data/hallConfigs';
import { useElderStore } from '@state/elderStore';
import { usePrestigeStore } from '@state/prestigeStore';

function resetStores() {
  useGameStore.getState().reset();
  useHallStore.setState({ halls: {}, buyMode: 1 });
  useElderStore.setState({ elders: {} });
  usePrestigeStore.setState({
    totalHDP: 0,
    spentHDP: 0,
    hdpShopPurchases: {},
    automationUnlocks: {},
    ascensionHistory: { count: 0, bestHDP: 0, fastestAscension: Infinity },
  });
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

  it('buy x1 on Hall 1 spends stones and increases level', async () => {
    render(<SectMountain />);

    // Build enough SS manually to guarantee affordability.
    // Use meditate first so component state rerenders naturally.
    act(() => {
      useGameStore.getState().addSpiritStones(HALL_CONFIGS[0].baseCost.mul(5));
    });
    fireEvent.click(screen.getByRole('button', { name: /meditate/i }));

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

    await waitFor(() => {
      expect(afterLevel).toBeGreaterThan(beforeLevel);
      expect(afterSS).toBeLessThan(beforeSS);
    });
  });

  it('onboarding guide advances through early progression steps', async () => {
    render(<SectMountain />);

    expect(screen.getByTestId('onboarding-next-step').textContent).toMatch(/Meditate/i);

    // Step 1: meditate once
    fireEvent.click(screen.getByTestId('meditate-btn'));
    expect(screen.getByTestId('onboarding-next-step').textContent).toMatch(/Buy your first level/i);

    // Step 2: buy Hall 1 once
    act(() => {
      useGameStore.getState().addSpiritStones(HALL_CONFIGS[0].baseCost.mul(5));
    });
    fireEvent.click(screen.getByTestId('meditate-btn'));
    const hallOneBuy = screen.getByTestId('buy-hall-1');
    fireEvent.click(hallOneBuy);
    expect(screen.getByTestId('onboarding-next-step').textContent).toMatch(/Body Tempering Dojo|Hall 2/i);

    // Step 3: unlock Hall 2 (triggered by first hall progression)
    act(() => {
      useGameStore.getState().addSpiritStones(HALL_CONFIGS[1].baseCost.mul(2));
    });
    fireEvent.click(screen.getByTestId('meditate-btn'));
    const hallTwoBuy = screen.getByTestId('buy-hall-2');
    fireEvent.click(hallTwoBuy);
    expect(screen.getByTestId('onboarding-next-step').textContent).toMatch(/Hire Elder Qin/i);

    // Step 4: hire first elder
    act(() => {
      useGameStore.getState().addSpiritStones(HALL_CONFIGS[0].baseCost.mul(1000));
    });
    fireEvent.click(screen.getByTestId('meditate-btn'));
    act(() => {
      const elderStore = useElderStore.getState();
      elderStore.initElder(1);
      elderStore.hireElder(1, {
        id: 1,
        hallId: 1,
        cost: HALL_CONFIGS[0].baseCost,
      });
    });
    await waitFor(() => {
    expect(screen.getByTestId('onboarding-next-step').textContent).toMatch(/Heavenly Dao Point preview/i);
    });
  });
});
