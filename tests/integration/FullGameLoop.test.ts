import { describe, it, expect, beforeEach } from 'vitest';
import Decimal from 'break_infinity.js';
import { D } from '@core/BigNumber';
import { useGameStore } from '@state/gameStore';
import { useHallStore } from '@state/hallStore';
import type { HallConfigLookup } from '@state/hallStore';

/**
 * FullGameLoop integration test.
 *
 * Simulates multiple ticks of the game loop to verify
 * revenue accumulation over time.
 */

const HALL_1_CONFIG: HallConfigLookup = {
  id: 1,
  baseCost: D(4),
  coefficient: 1.07,
  cycleSeconds: 1,
  baseRevenue: D(0.08),
};

describe('FullGameLoop Integration', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
    // Reset hall store
    useHallStore.setState({ halls: {}, buyMode: 1 });
  });

  it('should accumulate revenue over simulated ticks', () => {
    // Setup: Hall 1 at level 1, automated
    useHallStore.getState().initHall(1);
    useHallStore.getState().unlockHall(1);
    useHallStore.getState().buyHall(1, 1);
    useHallStore.getState().setAutomated(1, true);

    // Simulate 1000 ticks at 20Hz = 50 seconds
    const dt = 0.05; // 50ms per tick
    for (let tick = 0; tick < 1000; tick++) {
      useHallStore.getState().tickCycles(dt, [HALL_1_CONFIG]);
    }

    // Hall 1: cycleSeconds = 1, so in 50 seconds = 50 cycles
    // Revenue per cycle = 0.08 * 1 * 1 (profitMult) = 0.08
    // Total = 50 * 0.08 = 4.0 SS
    const ss = useGameStore.getState().spiritStones;
    expect(ss.toNumber()).toBeCloseTo(4.0, 1);
  });

  it('should complete correct number of cycles at level 1', () => {
    useHallStore.getState().initHall(1);
    useHallStore.getState().unlockHall(1);
    useHallStore.getState().buyHall(1, 1);
    useHallStore.getState().setAutomated(1, true);

    const dt = 0.05;
    const totalTicks = 1000; // 50 seconds
    for (let tick = 0; tick < totalTicks; tick++) {
      useHallStore.getState().tickCycles(dt, [HALL_1_CONFIG]);
    }

    // 50 seconds / 1 second cycle = 50 cycles -> 50 * 0.08 = 4.0
    const earned = useGameStore.getState().spiritStones.toNumber();
    expect(earned).toBeCloseTo(4.0, 1);
  });

  it('should earn more at higher levels', () => {
    useHallStore.getState().initHall(1);
    useHallStore.getState().unlockHall(1);
    useHallStore.getState().buyHall(1, 10);
    useHallStore.getState().setAutomated(1, true);

    const dt = 0.05;
    for (let tick = 0; tick < 1000; tick++) {
      useHallStore.getState().tickCycles(dt, [HALL_1_CONFIG]);
    }

    // 50 cycles * 0.08 * 10 = 40.0 SS
    const earned = useGameStore.getState().spiritStones.toNumber();
    expect(earned).toBeCloseTo(40.0, 1);
  });

  it('should not tick non-automated halls with 0 progress', () => {
    useHallStore.getState().initHall(1);
    useHallStore.getState().unlockHall(1);
    useHallStore.getState().buyHall(1, 1);
    // NOT automated and cycleProgress is 0

    const dt = 0.05;
    for (let tick = 0; tick < 100; tick++) {
      useHallStore.getState().tickCycles(dt, [HALL_1_CONFIG]);
    }

    expect(useGameStore.getState().spiritStones.toNumber()).toBe(0);
  });

  it('should apply speed multiplier to reduce cycle time', () => {
    useHallStore.getState().initHall(1);
    useHallStore.getState().unlockHall(1);
    useHallStore.getState().buyHall(1, 1);
    useHallStore.getState().setAutomated(1, true);
    useHallStore.getState().setSpeedMultiplier(1, D(2));

    const dt = 0.05;
    for (let tick = 0; tick < 1000; tick++) {
      useHallStore.getState().tickCycles(dt, [HALL_1_CONFIG]);
    }

    // Speed x2 -> cycle time = 0.5s -> ~99 cycles in 50s (fractional tick loss)
    // Revenue ~ 99 * 0.08 = 7.92 (small loss due to tick granularity)
    const earned = useGameStore.getState().spiritStones.toNumber();
    expect(earned).toBeGreaterThan(7.5);
    expect(earned).toBeLessThanOrEqual(8.0);
  });

  it('should apply profit multiplier to revenue per cycle', () => {
    useHallStore.getState().initHall(1);
    useHallStore.getState().unlockHall(1);
    useHallStore.getState().buyHall(1, 1);
    useHallStore.getState().setAutomated(1, true);
    useHallStore.getState().setProfitMultiplier(1, D(3));

    const dt = 0.05;
    for (let tick = 0; tick < 1000; tick++) {
      useHallStore.getState().tickCycles(dt, [HALL_1_CONFIG]);
    }

    // 50 cycles * 0.08 * 1 * 3 = 12.0
    const earned = useGameStore.getState().spiritStones.toNumber();
    expect(earned).toBeCloseTo(12.0, 1);
  });
});
