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
  { key: 'spiritStones', label: 'Spirit Stones', color: '#2d5a3d', isDecimal: true, unlockKey: null },
  { key: 'hdp', label: 'HDP', color: '#c9a84c', isDecimal: false, unlockKey: 'hdp' },
  { key: 'daoCrystals', label: 'DC', color: '#3d1f6d', isDecimal: false, unlockKey: 'daoCrystals' },
  { key: 'alchemyEssence', label: 'AE', color: '#c9a84c', isDecimal: true, unlockKey: 'alchemyEssence' },
  { key: 'recruitmentTokens', label: 'RT', color: '#1a7a6d', isDecimal: false, unlockKey: 'recruitmentTokens' },
  { key: 'heavenlySeals', label: 'HS', color: '#1a4a7a', isDecimal: false, unlockKey: 'heavenlySeals' },
  { key: 'qiResidue', label: 'QR', color: '#808080', isDecimal: false, unlockKey: 'qiResidue' },
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

  const values: Record<string, unknown> = {
    spiritStones, hdp, daoCrystals, alchemyEssence,
    recruitmentTokens, heavenlySeals, qiResidue,
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-[rgba(13,27,42,0.9)] border-b border-[rgba(45,90,61,0.3)] flex-wrap">
      {/* Spirit Stones + SS/s — always visible, prominent */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[rgba(13,27,42,0.6)] border border-[rgba(45,90,61,0.3)]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#2d5a3d]" />
        <span className="text-sm text-[#e8dcc8] font-mono font-bold">{formatNumber(spiritStones)}</span>
        <span className="text-xs text-[#3d7a52] font-mono">
          (+{formatNumber(totalPerSec)}/s)
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
          <div
            key={def.key}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[rgba(13,27,42,0.6)] border border-[rgba(45,90,61,0.2)]"
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: def.color }} />
            <span className="text-[10px] text-[#a89660] font-bold">{def.label}</span>
            <span className="text-xs text-[#e8dcc8] font-mono">{display}</span>
          </div>
        );
      })}
    </div>
  );
}
