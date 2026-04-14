import { useGameStore } from '@state/gameStore';
import { useHallStore } from '@state/hallStore';
import { formatNumber, D } from '@core/BigNumber';
import { HALL_CONFIGS } from '@data/hallConfigs';

/** Precompute hall config lookups for revenue calc */
const HALL_LOOKUPS = HALL_CONFIGS.map((c) => ({
  id: c.id, baseCost: c.baseCost, coefficient: c.coefficient,
  cycleSeconds: c.cycleSeconds, baseRevenue: c.baseRevenue,
}));

/** Currency display config */
const CURRENCY_DEFS = [
  { key: 'spiritStones', label: 'Spirit Stones', color: '#4a9968', isDecimal: true, unlockKey: null },
  { key: 'hdp', label: 'Dao Points', color: '#c9a84c', isDecimal: false, unlockKey: 'hdp' },
  { key: 'daoCrystals', label: 'Dao Crystals', color: '#3d1f6d', isDecimal: false, unlockKey: 'daoCrystals' },
  { key: 'alchemyEssence', label: 'Essence', color: '#c9a84c', isDecimal: true, unlockKey: 'alchemyEssence' },
  { key: 'recruitmentTokens', label: 'Tokens', color: '#2ba695', isDecimal: false, unlockKey: 'recruitmentTokens' },
  { key: 'heavenlySeals', label: 'Seals', color: '#3d7ec4', isDecimal: false, unlockKey: 'heavenlySeals' },
  { key: 'qiResidue', label: 'Qi Residue', color: '#808080', isDecimal: false, unlockKey: 'qiResidue' },
] as const;

export function CurrencyBar() {
  const spiritStones = useGameStore((s) => s.spiritStones);
  const hdp = useGameStore((s) => s.hdp);
  const daoCrystals = useGameStore((s) => s.daoCrystals);
  const alchemyEssence = useGameStore((s) => s.alchemyEssence);
  const recruitmentTokens = useGameStore((s) => s.recruitmentTokens);
  const heavenlySeals = useGameStore((s) => s.heavenlySeals);
  const qiResidue = useGameStore((s) => s.qiResidue);

  // Total SS/s — the most watched number in the game
  // Subscribe to halls to re-render when levels change
  useHallStore((s) => s.halls);
  const totalPerSec = useHallStore.getState().getTotalRevenuePerSecond(HALL_LOOKUPS);
  const topIncomeHalls = HALL_LOOKUPS
    .map((cfg) => {
      const hall = useHallStore.getState().halls[cfg.id];
      if (!hall || !hall.isUnlocked || hall.level <= 0) return null;
      const perCycle = useHallStore.getState().getRevenue(cfg.id, cfg);
      const perSecond = perCycle.div(cfg.cycleSeconds / hall.speedMultiplier.toNumber());
      return { hallId: cfg.id, perSecond };
    })
    .filter((entry): entry is { hallId: number; perSecond: ReturnType<typeof D> } => entry !== null)
    .sort((a, b) => b.perSecond.cmp(a.perSecond))
    .slice(0, 3);

  const values: Record<string, unknown> = {
    spiritStones, hdp, daoCrystals, alchemyEssence,
    recruitmentTokens, heavenlySeals, qiResidue,
  };

  return (
    <div className="currency-bar flex items-center gap-2 px-5 py-2.5 flex-wrap relative z-[3]">
      {/* Spirit Stones + SS/s — always visible, prominent */}
      <div className="currency-pill" style={{ borderColor: 'rgba(45, 90, 61, 0.3)' }}>
        <span className="currency-dot" style={{ color: '#4a9968', backgroundColor: '#4a9968' }} />
        <span className="currency-value">{formatNumber(spiritStones)}</span>
        <span className="currency-rate">
          +{formatNumber(totalPerSec)}/s
        </span>
      </div>

      {/* Other currencies — show only if > 0 */}
      {CURRENCY_DEFS.slice(1).map((def) => {
        const val = values[def.key];
        const raw = def.isDecimal ? (val as ReturnType<typeof D>).toNumber() : (val as number);
        if (raw <= 0) return null;

        const display = def.isDecimal
          ? formatNumber(val as ReturnType<typeof D>)
          : formatNumber(D(val as number));

        return (
          <div key={def.key} className="currency-pill">
            <span className="currency-dot" style={{ color: def.color, backgroundColor: def.color }} />
            <span className="currency-label">{def.label}</span>
            <span className="currency-value">{display}</span>
          </div>
        );
      })}

      {/* Economy transparency: top contributors */}
      {topIncomeHalls.length > 0 && (
        <div className="ml-auto text-[10px] text-gold-muted font-mono">
          Top income: {topIncomeHalls.map((r) => `H${r.hallId}:${formatNumber(r.perSecond)}/s`).join(' | ')}
        </div>
      )}
    </div>
  );
}
