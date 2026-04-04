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
      data-element={config.element}
      className={`
        hall-card
        ${showMilestoneBurst ? 'animate-milestone-burst' : ''}
        ${proximityGlow}
        ${isManualClickable ? 'cursor-pointer hover:border-[rgba(26,122,109,0.4)]' : ''}
      `}
    >
      {/* Click hint for manual halls */}
      {isManualClickable && (
        <div className="absolute top-2 right-3 text-[9px] text-[#2ba695] animate-breathe tracking-wider uppercase"
          style={{ fontFamily: "'Cinzel', serif" }}>
          tap to cultivate
        </div>
      )}

      {/* Header: icon + name + level + revenue */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="hall-element-icon">{ELEMENT_ICONS[config.element] ?? '☯️'}</span>
          <div>
            <h3 className="hall-name leading-tight">{config.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="hall-level">Level {state.level}</span>
              {elder?.hired && (
                <span className="px-1.5 py-0.5 rounded bg-[rgba(45,90,61,0.15)] text-[#52a36d] text-[9px] tracking-wider uppercase"
                  style={{ fontFamily: "'Cinzel', serif" }}>
                  Elder
                </span>
              )}
            </div>
            {nextMilestone && (
              <div className={`text-[10px] mt-0.5 ${nextMilestone.toGo <= 5 ? 'text-gold' : 'text-gold-muted'}`}
                style={{ fontFamily: "'Crimson Pro', serif" }}>
                Level {nextMilestone.level} = {nextMilestone.reward} ({nextMilestone.toGo} to go)
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="hall-revenue">{formatNumber(revenuePerSec)}/s</div>
        </div>
      </div>

      {/* Cycle progress bar */}
      <div className="cycle-bar-track mb-2.5">
        <div
          ref={progressRef}
          className="cycle-bar-fill"
          style={{
            width: `${state.cycleProgress * 100}%`,
            transition: state.cycleProgress > 0.01 ? 'width 200ms linear' : 'none',
            boxShadow: state.cycleProgress > 0 ? '0 0 8px rgba(45,90,61,0.3)' : 'none',
          }}
        />
      </div>

      {/* Buy row */}
      <div className="flex items-center justify-between">
        <div className="text-[11px] text-gold-muted" style={{ fontFamily: "'Crimson Pro', serif" }}>
          Cost: <span className="text-warm-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{formatNumber(buyCost)}</span>
        </div>
        <button
          onClick={handleBuy}
          disabled={!canAfford}
          className={`buy-btn ${canAfford ? 'affordable' : 'disabled'}`}
        >
          Buy {buyMode === 'max' ? `Max (${buyCount})` : `x${buyMode}`}
        </button>
      </div>
    </div>
  );
}

export const HallCard = memo(HallCardInner);
