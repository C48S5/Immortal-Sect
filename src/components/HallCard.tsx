import { memo, useRef, useEffect, useState, useCallback } from 'react';
import Decimal from 'break_infinity.js';
import { formatNumber, bulkCost, maxAffordable, D } from '@core/BigNumber';
import type { HallConfig, HallState } from '@models/hall';
import type { ElderState } from '@models/elder';
import { useHallStore } from '@state/hallStore';
import type { BuyMode } from '@state/hallStore';
import { getMilestoneConfig } from '@systems/MilestoneSystem';

interface HallCardProps {
  config: HallConfig;
  state: HallState;
  elder: ElderState | null;
  spiritStones: Decimal;
  buyMode: BuyMode;
  onBuy: (hallId: number, count: number) => void;
}

/** Hall milestones for glow proximity */
const MILESTONE_LEVELS = [25, 50, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000];

function getNextMilestoneInfo(hallId: number, level: number): { level: number; reward: string; toGo: number } | null {
  const milestones = getMilestoneConfig(hallId);
  for (const m of milestones) {
    if (level < m.level) {
      const reward = m.effectType === 'speed'
        ? `x${m.multiplier} speed`
        : m.effectType === 'profit'
        ? `x${m.multiplier} profit`
        : m.effectType === 'allProfit'
        ? `x${m.multiplier} ALL profit`
        : m.effectType === 'allSpeed'
        ? `x${m.multiplier} ALL speed`
        : `x${m.multiplier}`;
      return { level: m.level, reward, toGo: m.level - level };
    }
  }
  return null;
}

function getNextMilestone(level: number): number | null {
  for (const m of MILESTONE_LEVELS) {
    if (level < m) return m;
  }
  return null;
}

function getMilestoneProximityGlow(level: number): string {
  const next = getNextMilestone(level);
  if (!next) return '';
  const distance = next - level;
  if (distance <= 5) return 'animate-pulse-gold';
  if (distance <= 15) return 'shadow-[0_0_8px_rgba(201,168,76,0.3)]';
  return '';
}

const ELEMENT_ICONS: Record<string, string> = {
  fire: '🔥', water: '💧', wood: '🌿', metal: '⚔️', earth: '🏔️', neutral: '☯️',
};

function HallCardInner({ config, state, elder, spiritStones, buyMode, onBuy }: HallCardProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const [showMilestoneBurst, setShowMilestoneBurst] = useState(false);
  const prevLevel = useRef(state.level);

  // Update progress bar width directly from state
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${Math.min(state.cycleProgress * 100, 100)}%`;
    }
  }, [state.cycleProgress]);

  // Detect milestone bursts
  useEffect(() => {
    if (state.level > prevLevel.current) {
      const prev = prevLevel.current;
      for (const m of MILESTONE_LEVELS) {
        if (prev < m && state.level >= m) {
          setShowMilestoneBurst(true);
          const timer = setTimeout(() => setShowMilestoneBurst(false), 600);
          return () => clearTimeout(timer);
        }
      }
    }
    prevLevel.current = state.level;
  }, [state.level]);

  const revenuePerSec = state.level > 0
    ? config.baseRevenue
        .mul(state.level)
        .mul(state.milestoneProfitMult)
        .div(config.cycleSeconds / state.milestoneSpeedMult)
    : D(0);

  // Compute buy count and cost based on current mode
  const buyCount = (() => {
    if (state.level === 0) return spiritStones.gte(config.baseCost) ? 1 : 0;
    if (buyMode === 'max') {
      return maxAffordable(config.baseCost, config.coefficient, state.level, spiritStones);
    }
    return buyMode as number;
  })();

  const effectiveCount = Math.max(buyCount, 1); // For cost display, show at least x1 cost
  const buyCost = state.level === 0
    ? config.baseCost
    : bulkCost(config.baseCost, config.coefficient, state.level, effectiveCount);
  const canAfford = buyCount > 0 && spiritStones.gte(buyCost);

  const handleCardClick = useCallback(() => {
    // Click anywhere on the card to start a manual cycle
    if (state.level > 0 && state.cycleProgress === 0 && !state.isRunning) {
      useHallStore.getState().startManualCycle(config.id);
    }
  }, [config.id, state.level, state.cycleProgress, state.isRunning]);

  const handleBuy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger card click
    onBuy(config.id, buyCount || 1);
  }, [config.id, buyCount, onBuy]);

  const nextMilestone = getNextMilestoneInfo(config.id, state.level);
  const proximityGlow = getMilestoneProximityGlow(state.level);
  const isManualClickable = state.level > 0 && state.cycleProgress === 0 && !state.isRunning;

  return (
    <div
      onClick={handleCardClick}
      className={`
        relative p-3 rounded-lg border transition-all duration-200
        bg-[rgba(13,27,42,0.85)] border-[rgba(45,90,61,0.3)]
        ${showMilestoneBurst ? 'animate-milestone-burst' : ''}
        ${proximityGlow}
        ${isManualClickable ? 'cursor-pointer hover:border-[rgba(26,122,109,0.6)] hover:bg-[rgba(13,27,42,0.95)]' : ''}
      `}
    >
      {/* Click hint for manual halls */}
      {isManualClickable && (
        <div className="absolute top-1 right-2 text-[10px] text-[#1a7a6d] animate-pulse">
          click to cultivate
        </div>
      )}

      {/* Header: icon + name + level + revenue */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xl">{ELEMENT_ICONS[config.element] ?? '☯️'}</span>
          <div>
            <h3 className="text-sm font-bold text-[#e8dcc8] leading-tight">{config.name}</h3>
            <div className="flex items-center gap-2 text-xs text-[#a89660]">
              <span>Lv {state.level}</span>
              {elder?.hired && (
                <span className="px-1 py-0.5 rounded bg-[rgba(45,90,61,0.3)] text-[#3d7a52] text-[10px]">
                  Elder ✓
                </span>
              )}
            </div>
            {nextMilestone && (
              <div className={`text-[11px] ${nextMilestone.toGo <= 5 ? 'text-[#c9a84c] font-bold' : 'text-[#a89660]'}`}>
                Lv {nextMilestone.level} = {nextMilestone.reward} ({nextMilestone.toGo} to go)
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-[#2d5a3d] font-mono font-bold">{formatNumber(revenuePerSec)}/s</div>
        </div>
      </div>

      {/* Cycle progress bar — BIG, visible, smooth CSS transition */}
      <div className="w-full h-5 rounded-full bg-[rgba(13,27,42,0.6)] border border-[rgba(45,90,61,0.2)] overflow-hidden mb-2 relative">
        <div
          ref={progressRef}
          className="h-full rounded-full cycle-bar-fill"
          style={{
            width: `${state.cycleProgress * 100}%`,
            transition: state.cycleProgress > 0.01 ? 'width 200ms linear' : 'none',
            boxShadow: state.cycleProgress > 0 ? '0 0 6px rgba(46,139,87,0.4)' : 'none',
          }}
        />
        {state.level > 0 && state.isRunning && (
          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-[#e8dcc8]/60 font-mono pointer-events-none">
            {Math.round(state.cycleProgress * 100)}%
          </div>
        )}
      </div>

      {/* Single buy button on the right */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-[#a89660]">
          Cost: <span className="text-[#e8dcc8] font-mono">{formatNumber(buyCost)}</span>
        </div>
        <button
          onClick={handleBuy}
          disabled={!canAfford}
          className={`
            px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-150
            ${canAfford
              ? 'bg-[rgba(201,168,76,0.2)] border border-[#c9a84c] text-[#c9a84c] hover:bg-[rgba(201,168,76,0.35)] animate-pulse-gold'
              : 'bg-[rgba(13,27,42,0.4)] border border-[rgba(45,90,61,0.15)] text-[#a89660]/40 cursor-not-allowed'
            }
          `}
        >
          Buy {buyMode === 'max' ? `Max (${buyCount})` : `x${buyMode}`}
        </button>
      </div>
    </div>
  );
}

export const HallCard = memo(HallCardInner);
