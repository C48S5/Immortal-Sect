import { describe, it, expect, beforeEach } from 'vitest';
import Decimal from 'break_infinity.js';
import { D } from '@core/BigNumber';
import { usePrestigeStore } from '@state/prestigeStore';
import { useGameStore } from '@state/gameStore';

describe('PrestigeSystem', () => {
  beforeEach(() => {
    // Reset stores between tests
    usePrestigeStore.setState({
      totalHDP: 0,
      spentHDP: 0,
      hdpShopPurchases: {},
      automationUnlocks: {},
      ascensionHistory: { count: 0, bestHDP: 0, fastestAscension: Infinity },
      totalRevenueThisRun: D(0),
    });
    useGameStore.getState().reset();
  });

  describe('HDP formula: floor(sqrt(totalRevenue / 44.44B))', () => {
    it('should yield 4 HDP for 1T total revenue', () => {
      usePrestigeStore.setState({ totalRevenueThisRun: D(1e12) });
      const preview = usePrestigeStore.getState().getHDPPreview();
      // sqrt(1e12 / 44.44e9) = sqrt(22.497) ≈ 4.743 -> floor = 4
      expect(preview).toBe(4);
    });

    it('should yield 47 HDP for 100T total revenue', () => {
      usePrestigeStore.setState({ totalRevenueThisRun: D(100e12) });
      const preview = usePrestigeStore.getState().getHDPPreview();
      // sqrt(100e12 / 44.44e9) = sqrt(2250.23) ≈ 47.437 -> floor = 47
      expect(preview).toBe(47);
    });

    it('should yield ~150 HDP for 1Qa total revenue', () => {
      usePrestigeStore.setState({ totalRevenueThisRun: D(1e15) });
      const preview = usePrestigeStore.getState().getHDPPreview();
      // sqrt(1e15 / 44.44e9) = sqrt(22502.25) ≈ 150.007 -> floor = 150
      expect(preview).toBe(150);
    });

    it('should yield 0 HDP when revenue < 44.44B', () => {
      usePrestigeStore.setState({ totalRevenueThisRun: D(10e9) });
      const preview = usePrestigeStore.getState().getHDPPreview();
      expect(preview).toBe(0);
    });

    it('should yield 0 HDP when revenue is 0', () => {
      usePrestigeStore.setState({ totalRevenueThisRun: D(0) });
      expect(usePrestigeStore.getState().getHDPPreview()).toBe(0);
    });
  });

  describe('HDP multiplier: 1 + (totalHDP - spentHDP) * 0.02', () => {
    it('should return x3 for 100 HDP, 0 spent', () => {
      usePrestigeStore.setState({ totalHDP: 100, spentHDP: 0 });
      const mult = usePrestigeStore.getState().getHDPMultiplier();
      expect(mult).toBeCloseTo(3, 5);
    });

    it('should return x21 for 1000 HDP, 0 spent', () => {
      usePrestigeStore.setState({ totalHDP: 1000, spentHDP: 0 });
      const mult = usePrestigeStore.getState().getHDPMultiplier();
      expect(mult).toBeCloseTo(21, 5);
    });

    it('should account for spent HDP', () => {
      usePrestigeStore.setState({ totalHDP: 100, spentHDP: 50 });
      const mult = usePrestigeStore.getState().getHDPMultiplier();
      // 1 + 50 * 0.02 = 2.0
      expect(mult).toBeCloseTo(2, 5);
    });

    it('should return x1 when all HDP spent', () => {
      usePrestigeStore.setState({ totalHDP: 100, spentHDP: 100 });
      expect(usePrestigeStore.getState().getHDPMultiplier()).toBeCloseTo(1, 5);
    });
  });

  describe('canAscend', () => {
    it('should return false when preview HDP is 0', () => {
      usePrestigeStore.setState({ totalRevenueThisRun: D(0) });
      expect(usePrestigeStore.getState().canAscend()).toBe(false);
    });

    it('should return true when preview HDP > 0', () => {
      usePrestigeStore.setState({ totalRevenueThisRun: D(1e12) });
      expect(usePrestigeStore.getState().canAscend()).toBe(true);
    });
  });

  describe('spendHDP', () => {
    it('should succeed when enough available', () => {
      usePrestigeStore.setState({ totalHDP: 100, spentHDP: 0 });
      const result = usePrestigeStore.getState().spendHDP(50);
      expect(result).toBe(true);
      expect(usePrestigeStore.getState().spentHDP).toBe(50);
    });

    it('should fail when not enough available', () => {
      usePrestigeStore.setState({ totalHDP: 100, spentHDP: 90 });
      const result = usePrestigeStore.getState().spendHDP(20);
      expect(result).toBe(false);
      expect(usePrestigeStore.getState().spentHDP).toBe(90);
    });
  });

  describe('addRevenue', () => {
    it('should accumulate revenue for HDP calculation', () => {
      usePrestigeStore.getState().addRevenue(D(1000));
      usePrestigeStore.getState().addRevenue(D(2000));
      expect(usePrestigeStore.getState().totalRevenueThisRun.toNumber()).toBe(3000);
    });
  });

  describe('Ascension resets', () => {
    it('should reset SS to 0 on ascension', () => {
      useGameStore.getState().addSpiritStones(D(1e12));
      usePrestigeStore.setState({ totalRevenueThisRun: D(1e12) });

      usePrestigeStore.getState().performAscension([], 3600);

      expect(useGameStore.getState().spiritStones.toNumber()).toBe(0);
    });

    it('should reset AE to 0 on ascension', () => {
      useGameStore.getState().addAE(D(500));
      usePrestigeStore.setState({ totalRevenueThisRun: D(1e12) });

      usePrestigeStore.getState().performAscension([], 3600);

      expect(useGameStore.getState().alchemyEssence.toNumber()).toBe(0);
    });

    it('should preserve and add HDP on ascension', () => {
      usePrestigeStore.setState({
        totalHDP: 10,
        totalRevenueThisRun: D(1e12), // should give ~4 HDP
      });

      usePrestigeStore.getState().performAscension([], 3600);

      // Should have old 10 + new ~4 = 14
      expect(usePrestigeStore.getState().totalHDP).toBe(14);
    });

    it('should preserve DC on ascension', () => {
      useGameStore.setState({ daoCrystals: 50 });
      usePrestigeStore.setState({ totalRevenueThisRun: D(1e12) });

      usePrestigeStore.getState().performAscension([], 3600);

      expect(useGameStore.getState().daoCrystals).toBe(50);
    });

    it('should increment ascension count', () => {
      usePrestigeStore.setState({ totalRevenueThisRun: D(1e12) });
      usePrestigeStore.getState().performAscension([], 3600);

      expect(useGameStore.getState().ascensionCount).toBe(1);
      expect(usePrestigeStore.getState().ascensionHistory.count).toBe(1);
    });

    it('should track best HDP in history', () => {
      usePrestigeStore.setState({ totalRevenueThisRun: D(100e12) });
      usePrestigeStore.getState().performAscension([], 3600);

      expect(usePrestigeStore.getState().ascensionHistory.bestHDP).toBe(47);
    });

    it('should reset totalRevenueThisRun on ascension', () => {
      usePrestigeStore.setState({ totalRevenueThisRun: D(1e12) });
      usePrestigeStore.getState().performAscension([], 3600);

      expect(usePrestigeStore.getState().totalRevenueThisRun.toNumber()).toBe(0);
    });
  });
});
