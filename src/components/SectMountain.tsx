import { useState, useCallback, useMemo } from 'react';
import { useGameStore } from '@state/gameStore';
import { useHallStore } from '@state/hallStore';
import { useElderStore } from '@state/elderStore';
import { useMissionStore } from '@state/missionStore';
import { D, bulkCost, formatNumber } from '@core/BigNumber';
import { HallCard } from './HallCard';
import type { HallState } from '@models/hall';
import type { ElderState } from '@models/elder';
import { HALL_CONFIGS } from '@data/hallConfigs';
import type { HallConfigLookup, BuyMode } from '@state/hallStore';

/** Sect Harmony thresholds matching sectHarmonyConfigs.ts */
const HARMONY_THRESHOLDS = [25, 50, 100, 150, 200, 250, 300, 400, 500, 750, 1000, 1500, 2000, 3000, 5000];

function getNextHarmonyThreshold(minLevel: number): number | null {
  for (const t of HARMONY_THRESHOLDS) {
    if (minLevel < t) return t;
  }
  return null;
}

function getHarmonyReachedCount(minLevel: number): number {
  let count = 0;
  for (const t of HARMONY_THRESHOLDS) {
    if (minLevel >= t) count++;
  }
  return count;
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
    useMissionStore.getState().addProgress('meditate', 1);
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
      useMissionStore.getState().addProgress('buyHallLevels', count);
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
  const { minLevel, nextHarmony, unlockedCount, reachedCount } = useMemo(() => {
    const unlockedLevels = hallStates.filter((h) => h.unlocked).map((h) => h.level);
    const min = unlockedLevels.length === 12 ? Math.min(...unlockedLevels) : 0;
    return {
      minLevel: min,
      nextHarmony: getNextHarmonyThreshold(min),
      unlockedCount: unlockedLevels.length,
      reachedCount: getHarmonyReachedCount(min),
    };
  }, [hallStates]);

  return (
    <div className="flex flex-col h-full">
      {/* Meditate formation */}
      <div className="flex flex-col items-center py-8">
        <div className="meditate-formation">
          <div className="meditate-outer-ring" />
          <div className="meditate-inner-ring" />
          <button
            onClick={handleMeditate}
            className={`meditate-btn ${isMeditating ? 'animate-bounce-click' : ''}`}
          >
            <span className="meditate-icon">&#9775;</span>
            <span>Meditate</span>
          </button>
        </div>
        <div className="mt-3 text-xs text-gold-muted tracking-wider" style={{ fontFamily: "'Crimson Pro', serif" }}>
          +{(() => {
            const inc = useHallStore.getState().getTotalRevenuePerSecond(HALL_CONFIG_LOOKUPS);
            return inc.gt(1) ? formatNumber(inc) : '1';
          })()} Spirit Stones per meditation
        </div>
      </div>

      {/* Sect Harmony indicator */}
      {unlockedCount > 1 && (
        <div className="mx-5 mb-4 harmony-bar text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="text-[10px] text-gold-muted tracking-widest uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
              Sect Harmony
            </div>
            {reachedCount > 0 && (
              <span className="text-[10px] text-success font-mono">
                {reachedCount}/{HARMONY_THRESHOLDS.length} milestones
              </span>
            )}
          </div>
          {nextHarmony ? (
            <>
              <div className="text-xs text-warm-white mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                All halls to Level {nextHarmony}: {minLevel}/{nextHarmony}
              </div>
              <div className="w-full h-1.5 rounded-full bg-[rgba(10,15,26,0.6)] mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#a89660] to-[#c9a84c] transition-all duration-300"
                  style={{ width: `${Math.min((minLevel / nextHarmony) * 100, 100)}%` }}
                />
              </div>
            </>
          ) : (
            <div className="text-xs text-success mt-0.5">All milestones reached!</div>
          )}
          {unlockedCount < 12 && (
            <div className="text-[10px] text-gold-muted mt-1">
              Unlock all 12 halls to begin ({unlockedCount}/12)
            </div>
          )}
        </div>
      )}

      {/* Mountain backdrop + hall cards */}
      <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2.5">
        {/* Mountain silhouette */}
        <div className="relative h-20 mb-3 mountain-backdrop">
          <svg viewBox="0 0 500 70" className="w-full h-full opacity-15" preserveAspectRatio="none">
            <defs>
              <linearGradient id="mtnGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#52a36d" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#1d3a28" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="mtnGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4a9968" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0a0f1a" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <polygon
              points="0,70 30,30 80,42 130,15 180,28 220,8 280,22 330,12 380,25 430,18 470,32 500,28 500,70"
              fill="url(#mtnGrad1)"
            />
            <polygon
              points="0,70 60,38 120,50 180,30 240,42 300,25 360,35 420,28 480,40 500,38 500,70"
              fill="url(#mtnGrad2)"
            />
            {/* Subtle cloud wisps */}
            <ellipse cx="100" cy="35" rx="60" ry="4" fill="rgba(168,150,96,0.04)" />
            <ellipse cx="350" cy="28" rx="50" ry="3" fill="rgba(168,150,96,0.03)" />
          </svg>
        </div>

        {/* Buy mode selector */}
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <span className="text-[10px] text-gold-muted mr-2 tracking-widest uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
            Buy
          </span>
          {([1, 10, 100, 'max'] as BuyMode[]).map((mode) => (
            <button
              key={String(mode)}
              onClick={() => setBuyMode(mode)}
              className={`buy-mode-btn ${buyMode === mode ? 'active' : ''}`}
            >
              {mode === 'max' ? 'Max' : `x${mode}`}
            </button>
          ))}
        </div>

        {/* Hall cards - reversed so cheapest at bottom */}
        <div className="flex flex-col-reverse gap-2.5">
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
