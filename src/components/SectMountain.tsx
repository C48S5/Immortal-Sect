import { useState, useCallback, useMemo } from 'react';
import { useGameStore } from '@state/gameStore';
import { useHallStore } from '@state/hallStore';
import { useElderStore } from '@state/elderStore';
import { D, bulkCost, formatNumber } from '@core/BigNumber';
import { HallCard } from './HallCard';
import type { HallState } from '@models/hall';
import type { ElderState } from '@models/elder';
import { HALL_CONFIGS } from '@data/hallConfigs';
import type { HallConfigLookup, BuyMode } from '@state/hallStore';

/** Sect Harmony thresholds */
const HARMONY_THRESHOLDS = [10, 25, 50, 100, 150, 200, 250, 300, 400, 500];

function getNextHarmonyThreshold(minLevel: number): number | null {
  for (const t of HARMONY_THRESHOLDS) {
    if (minLevel < t) return t;
  }
  return null;
}

/** Convert HALL_CONFIGS to lookup objects the store expects */
const HALL_CONFIG_LOOKUPS: HallConfigLookup[] = HALL_CONFIGS.map((c) => ({
  id: c.id,
  baseCost: c.baseCost,
  coefficient: c.coefficient,
  cycleSeconds: c.cycleSeconds,
  baseRevenue: c.baseRevenue,
}));

export function SectMountain() {
  const spiritStones = useGameStore((s) => s.spiritStones);
  const addSpiritStones = useGameStore((s) => s.addSpiritStones);

  // Zustand store subscriptions — single source of truth
  const halls = useHallStore((s) => s.halls);
  const elders = useElderStore((s) => s.elders);

  const [isMeditating, setIsMeditating] = useState(false);
  const [buyMode, setBuyMode] = useState<BuyMode>(1);

  // Meditate gives 1 full second of income (minimum 1 SS)
  // In Cash Inc., tapping equals one cycle of your best business.
  // This makes tapping powerful early game and still relevant later.
  const handleMeditate = useCallback(() => {
    const incomePerSec = useHallStore.getState().getTotalRevenuePerSecond(HALL_CONFIG_LOOKUPS);
    const tapBonus = incomePerSec.gt(1) ? incomePerSec : D(1);
    addSpiritStones(tapBonus);
    setIsMeditating(true);
    setTimeout(() => setIsMeditating(false), 150);
  }, [addSpiritStones]);

  const handleBuyHall = useCallback((hallId: number, count: number) => {
    const config = HALL_CONFIG_LOOKUPS[hallId - 1];
    if (!config) return;

    const slot = halls[hallId];

    // First purchase: unlock then buy
    if (!slot || !slot.isUnlocked || slot.level === 0) {
      const cost = config.baseCost;
      if (spiritStones.gte(cost)) {
        useGameStore.getState().spendSpiritStones(cost);
        useHallStore.getState().unlockHall(hallId);
        useHallStore.getState().buyHall(hallId, 1);
        // Start running after first purchase
        useHallStore.getState().setAutomated(hallId, false);
      }
      return;
    }

    // Subsequent purchases: use bulk cost
    const totalCost = bulkCost(config.baseCost, config.coefficient, slot.level, count);
    if (spiritStones.gte(totalCost)) {
      useGameStore.getState().spendSpiritStones(totalCost);
      useHallStore.getState().buyHall(hallId, count);
    }
  }, [halls, spiritStones]);

  /** Map HallSlot from store to HallState that HallCard expects */
  const hallStates: HallState[] = useMemo(() => {
    return HALL_CONFIGS.map((config) => {
      const slot = halls[config.id];
      if (!slot) {
        return {
          hallId: config.id,
          level: 0,
          unlocked: false,
          cycleProgress: 0,
          isRunning: false,
          milestoneSpeedMult: 1,
          milestoneProfitMult: 1,
          assignedDiscipleId: null,
          assignedElderId: null,
        };
      }
      return {
        hallId: config.id,
        level: slot.level,
        unlocked: slot.isUnlocked,
        cycleProgress: slot.cycleProgress,
        isRunning: slot.isAutomated,
        milestoneSpeedMult: slot.speedMultiplier.toNumber(),
        milestoneProfitMult: slot.profitMultiplier.toNumber(),
        assignedDiscipleId: null,
        assignedElderId: elders[config.id]?.hired ? config.id : null,
      };
    });
  }, [halls, elders]);

  /** Map elder store to ElderState that HallCard expects */
  const elderStates: (ElderState | null)[] = useMemo(() => {
    return HALL_CONFIGS.map((config) => {
      const elder = elders[config.id];
      if (!elder) return null;
      return { elderId: config.id, hired: elder.hired };
    });
  }, [elders]);

  // Visible halls: only unlocked OR the next affordable one
  const visibleHalls = useMemo(() => {
    return HALL_CONFIGS.filter((_config, i) => {
      const state = hallStates[i];
      if (state.unlocked) return true;
      // Show if first hall or previous hall is unlocked
      if (i === 0) return true;
      if (hallStates[i - 1].unlocked) return true;
      return false;
    });
  }, [hallStates]);

  // Sect Harmony
  const { minLevel, nextHarmony, unlockedCount } = useMemo(() => {
    const unlockedLevels = hallStates.filter((h) => h.unlocked).map((h) => h.level);
    const min = unlockedLevels.length === 12 ? Math.min(...unlockedLevels) : 0;
    return {
      minLevel: min,
      nextHarmony: getNextHarmonyThreshold(min),
      unlockedCount: unlockedLevels.length,
    };
  }, [hallStates]);

  return (
    <div className="flex flex-col h-full">
      {/* Meditate button */}
      <div className="flex flex-col items-center py-6">
        <button
          onClick={handleMeditate}
          className={`
            w-[120px] h-[120px] rounded-full
            bg-[rgba(26,122,109,0.2)] border-2 border-[#1a7a6d]
            text-[#1a7a6d] font-bold text-lg
            transition-all duration-150 cursor-pointer
            hover:bg-[rgba(26,122,109,0.35)] hover:shadow-[0_0_30px_rgba(26,122,109,0.4)]
            animate-pulse-jade
            ${isMeditating ? 'animate-bounce-click' : ''}
          `}
        >
          <div className="text-2xl mb-1">&#9775;</div>
          <div>Meditate</div>
        </button>
        <div className="mt-2 text-xs text-[#a89660]">
          +{(() => {
            const inc = useHallStore.getState().getTotalRevenuePerSecond(HALL_CONFIG_LOOKUPS);
            return inc.gt(1) ? formatNumber(inc) : '1';
          })()} SS per click
        </div>
      </div>

      {/* Sect Harmony indicator */}
      {unlockedCount > 1 && nextHarmony && (
        <div className="mx-4 mb-3 p-2 rounded bg-[rgba(13,27,42,0.6)] border border-[rgba(45,90,61,0.2)] text-center">
          <div className="text-xs text-[#a89660]">Sect Harmony</div>
          <div className="text-xs text-[#e8dcc8]">
            All halls to Lv {nextHarmony}: {minLevel}/{nextHarmony}
          </div>
          <div className="w-full h-1.5 rounded-full bg-[rgba(13,27,42,0.6)] mt-1 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#c9a84c] transition-all duration-300"
              style={{ width: `${Math.min((minLevel / nextHarmony) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Mountain backdrop + hall cards */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {/* Mountain silhouette */}
        <div className="relative h-16 mb-2">
          <svg viewBox="0 0 400 60" className="w-full h-full opacity-20">
            <polygon
              points="0,60 50,20 100,35 150,10 200,25 250,5 300,20 350,15 400,30 400,60"
              fill="#2d5a3d"
            />
            <polygon
              points="0,60 80,30 160,45 200,25 280,40 360,20 400,45 400,60"
              fill="#1d3a28"
            />
          </svg>
        </div>

        {/* Buy mode selector */}
        <div className="flex items-center justify-center gap-1 mb-2">
          <span className="text-xs text-[#a89660] mr-2">Buy:</span>
          {([1, 10, 100, 'max'] as BuyMode[]).map((mode) => (
            <button
              key={String(mode)}
              onClick={() => setBuyMode(mode)}
              className={`
                px-3 py-1 rounded text-xs font-bold transition-all duration-150
                ${buyMode === mode
                  ? 'bg-[rgba(201,168,76,0.25)] border border-[#c9a84c] text-[#c9a84c]'
                  : 'bg-[rgba(13,27,42,0.4)] border border-[rgba(45,90,61,0.2)] text-[#a89660] hover:text-[#e8dcc8]'
                }
              `}
            >
              {mode === 'max' ? 'Max' : `x${mode}`}
            </button>
          ))}
        </div>

        {/* Hall cards - reversed so cheapest at bottom */}
        <div className="flex flex-col-reverse gap-2">
          {visibleHalls.map((config) => {
            const state = hallStates[config.id - 1];
            const elder = elderStates[config.id - 1];

            return (
              <HallCard
                key={config.id}
                config={config}
                state={state}
                elder={elder}
                spiritStones={spiritStones}
                buyMode={buyMode}
                onBuy={handleBuyHall}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
