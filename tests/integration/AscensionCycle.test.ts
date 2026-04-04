import { describe, it, expect, beforeEach } from 'vitest';
import Decimal from 'break_infinity.js';
import { D } from '@core/BigNumber';
import { useGameStore } from '@state/gameStore';
import { usePrestigeStore } from '@state/prestigeStore';
import { useHallStore } from '@state/hallStore';
import { useElderStore } from '@state/elderStore';

/**
 * AscensionCycle integration test.
 *
 * Simulates: Start -> Earn SS -> Ascend -> Verify HDP ->
 * Verify resets -> Verify HDP multiplier applies.
 */

describe('AscensionCycle Integration', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
    usePrestigeStore.setState({
      totalHDP: 0,
      spentHDP: 0,
      hdpShopPurchases: {},
      automationUnlocks: {},
      ascensionHistory: { count: 0, bestHDP: 0, fastestAscension: Infinity },
      totalRevenueThisRun: D(0),
    });
    useHallStore.setState({ halls: {}, buyMode: 1 });
    useElderStore.setState({ elders: {} });

    // Initialize halls and elders
    for (let i = 1; i <= 12; i++) {
      useHallStore.getState().initHall(i);
      useElderStore.getState().initElder(i);
    }
    useHallStore.getState().unlockHall(1);
  });

  it('should complete a full ascension cycle', () => {
    // Step 1: Accumulate revenue
    usePrestigeStore.getState().addRevenue(D(1e12)); // 1T SS earned

    // Step 2: Preview HDP
    const previewHDP = usePrestigeStore.getState().getHDPPreview();
    expect(previewHDP).toBe(4); // sqrt(1T / 44.44B) ≈ 4.74 -> 4

    // Step 3: Can ascend
    expect(usePrestigeStore.getState().canAscend()).toBe(true);

    // Step 4: Perform ascension
    useGameStore.getState().addSpiritStones(D(1e12)); // Simulate having SS
    usePrestigeStore.getState().performAscension([], 3600);

    // Step 5: Verify HDP gained
    expect(usePrestigeStore.getState().totalHDP).toBe(4);

    // Step 6: Verify SS reset
    expect(useGameStore.getState().spiritStones.toNumber()).toBe(0);

    // Step 7: Verify AE reset
    expect(useGameStore.getState().alchemyEssence.toNumber()).toBe(0);

    // Step 8: Verify HDP multiplier
    const mult = usePrestigeStore.getState().getHDPMultiplier();
    // 1 + 4 * 0.02 = 1.08
    expect(mult).toBeCloseTo(1.08, 5);

    // Step 9: Verify revenue tracker reset
    expect(usePrestigeStore.getState().totalRevenueThisRun.toNumber()).toBe(0);

    // Step 10: Verify ascension count
    expect(useGameStore.getState().ascensionCount).toBe(1);
  });

  it('should accumulate HDP across multiple ascensions', () => {
    // First ascension: 1T revenue -> 4 HDP
    usePrestigeStore.getState().addRevenue(D(1e12));
    usePrestigeStore.getState().performAscension([], 3600);
    expect(usePrestigeStore.getState().totalHDP).toBe(4);

    // Second ascension: 100T revenue -> 47 HDP
    usePrestigeStore.getState().addRevenue(D(100e12));
    usePrestigeStore.getState().performAscension([], 1800);
    expect(usePrestigeStore.getState().totalHDP).toBe(4 + 47);

    // Total multiplier: 1 + 51 * 0.02 = 2.02
    expect(usePrestigeStore.getState().getHDPMultiplier()).toBeCloseTo(2.02, 2);
    expect(useGameStore.getState().ascensionCount).toBe(2);
  });

  it('should reset hall levels on ascension', () => {
    useHallStore.getState().buyHall(1, 100);
    expect(useHallStore.getState().halls[1].level).toBe(100);

    usePrestigeStore.getState().addRevenue(D(1e12));
    usePrestigeStore.getState().performAscension([], 3600);

    expect(useHallStore.getState().halls[1].level).toBe(0);
  });

  it('should only keep Hall 1 unlocked after ascension', () => {
    useHallStore.getState().unlockHall(2);
    useHallStore.getState().unlockHall(3);

    usePrestigeStore.getState().addRevenue(D(1e12));
    usePrestigeStore.getState().performAscension([], 3600);

    expect(useHallStore.getState().halls[1].isUnlocked).toBe(true);
    expect(useHallStore.getState().halls[2].isUnlocked).toBe(false);
    expect(useHallStore.getState().halls[3].isUnlocked).toBe(false);
  });

  it('should reset elder hired status on ascension', () => {
    useElderStore.setState({
      elders: {
        1: { hired: true },
        2: { hired: true },
        3: { hired: false },
      },
    });

    usePrestigeStore.getState().addRevenue(D(1e12));
    usePrestigeStore.getState().performAscension([], 3600);

    expect(useElderStore.getState().elders[1].hired).toBe(false);
    expect(useElderStore.getState().elders[2].hired).toBe(false);
  });

  it('should not ascend when revenue is insufficient', () => {
    usePrestigeStore.getState().addRevenue(D(10e9)); // 10B, less than 44.44B threshold
    expect(usePrestigeStore.getState().canAscend()).toBe(false);

    // Attempting ascension should have no effect
    usePrestigeStore.getState().performAscension([], 3600);
    expect(usePrestigeStore.getState().totalHDP).toBe(0);
    expect(useGameStore.getState().ascensionCount).toBe(0);
  });

  it('should track fastest ascension time', () => {
    usePrestigeStore.getState().addRevenue(D(1e12));
    usePrestigeStore.getState().performAscension([], 7200); // 2 hours

    usePrestigeStore.getState().addRevenue(D(1e12));
    usePrestigeStore.getState().performAscension([], 3600); // 1 hour

    expect(usePrestigeStore.getState().ascensionHistory.fastestAscension).toBe(3600);
  });
});
