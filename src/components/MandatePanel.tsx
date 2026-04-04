import { useEffect } from 'react';
import { useGameStore } from '@state/gameStore';
import { useMandateStore } from '@state/mandateStore';
import { MANDATE_CONFIG } from '@data/mandateConfigs';
import { HALL_CONFIGS } from '@data/hallConfigs';

export function MandatePanel() {
  const heavenlySeals = useGameStore((s) => s.heavenlySeals);
  const daoCrystals = useGameStore((s) => s.daoCrystals);

  const handleConvertDCtoHS = (amount: number) => {
    const dcCost = amount * 6;
    const gs = useGameStore.getState();
    if (gs.daoCrystals < dcCost) return;
    useGameStore.setState({
      daoCrystals: gs.daoCrystals - dcCost,
      heavenlySeals: gs.heavenlySeals + amount,
    });
  };

  const maxConvertible = Math.floor(daoCrystals / 6);

  const slots = useMandateStore((s) => s.slots);
  const initSlots = useMandateStore((s) => s.initSlots);
  const upgradeMandate = useMandateStore((s) => s.upgradeMandate);

  useEffect(() => {
    if (Object.keys(slots).length === 0) {
      initSlots();
    }
  }, [slots, initSlots]);

  const handleUpgrade = (hallId: number) => {
    upgradeMandate(hallId);
  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-header">Heavenly Mandates</h2>
        <div className="flex items-center gap-2 px-3 py-1 rounded bg-[rgba(26,74,122,0.1)] border border-[rgba(26,74,122,0.3)]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3d7ec4]" />
          <span className="text-sm font-mono text-[#3d7ec4]">{heavenlySeals} HS</span>
        </div>
      </div>

      {/* DC to HS Conversion */}
      <div className="mb-4 p-3 rounded-lg border bg-[rgba(13,27,42,0.85)] border-[rgba(88,44,131,0.4)]">
        <h3 className="text-sm font-bold text-warm-white mb-2">Crystal Transmutation</h3>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[rgba(88,44,131,0.15)] border border-[rgba(88,44,131,0.4)]">
            <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
            <span className="text-sm font-mono text-[#8b5cf6]">{daoCrystals} DC</span>
          </div>
          <span className="text-gold-muted text-xs">→</span>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)]">
            <span className="w-2 h-2 rounded-full bg-gold" />
            <span className="text-sm font-mono text-gold">{heavenlySeals} HS</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleConvertDCtoHS(1)}
            disabled={daoCrystals < 6}
            className={`
              px-4 py-1.5 rounded text-xs font-bold transition-all duration-150
              ${daoCrystals >= 6
                ? 'bg-[rgba(139,92,246,0.15)] border border-[#8b5cf6] text-[#8b5cf6] hover:bg-[rgba(139,92,246,0.3)]'
                : 'bg-[rgba(13,27,42,0.4)] border border-[rgba(45,90,61,0.15)] text-gold-muted/40 cursor-not-allowed'
              }
            `}
          >
            Transmute 6 DC → 1 HS
          </button>
          <button
            onClick={() => handleConvertDCtoHS(maxConvertible)}
            disabled={daoCrystals < 6}
            className={`
              px-4 py-1.5 rounded text-xs font-bold transition-all duration-150
              ${daoCrystals >= 6
                ? 'bg-[rgba(139,92,246,0.15)] border border-[#8b5cf6] text-[#8b5cf6] hover:bg-[rgba(139,92,246,0.3)]'
                : 'bg-[rgba(13,27,42,0.4)] border border-[rgba(45,90,61,0.15)] text-gold-muted/40 cursor-not-allowed'
              }
            `}
          >
            Transmute All ({maxConvertible} HS)
          </button>
        </div>
      </div>

      <p className="text-sm text-gold-muted mb-4">
        Bestow Heavenly Seals upon your halls. Each mandate permanently multiplies revenue,
        up to Level {MANDATE_CONFIG.levels.length}.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(slots).map(([hallIdStr, currentLevel]) => {
          const hallId = Number(hallIdStr);
          const maxLevel = MANDATE_CONFIG.levels.length;
          const currentMult = currentLevel > 0 ? MANDATE_CONFIG.levels[currentLevel - 1].multiplier : 1;
          const nextLevelConfig = currentLevel < maxLevel ? MANDATE_CONFIG.levels[currentLevel] : null;
          const canAfford = nextLevelConfig ? heavenlySeals >= nextLevelConfig.hsCost : false;
          const hallConfig = HALL_CONFIGS[hallId - 1];

          return (
            <div
              key={hallId}
              className="p-3 rounded-lg border bg-[rgba(13,27,42,0.85)] border-[rgba(45,90,61,0.3)] transition-all duration-200"
            >
              <h3 className="text-sm font-bold text-warm-white mb-1">
                {hallConfig?.name ?? `Hall ${hallId}`}
              </h3>

              {/* Level indicators */}
              <div className="flex gap-1 mb-2">
                {MANDATE_CONFIG.levels.map((lvlCfg) => (
                  <div
                    key={lvlCfg.level}
                    className={`
                      w-6 h-1.5 rounded-full transition-all duration-200
                      ${lvlCfg.level <= currentLevel ? 'bg-gold' : 'bg-[rgba(45,90,61,0.2)]'}
                    `}
                  />
                ))}
              </div>

              <div className="text-xs text-gold-muted mb-2">
                Multiplier: <span className="text-gold font-bold">x{currentMult}</span>
                {nextLevelConfig && (
                  <span className="text-gold-muted"> (next: x{nextLevelConfig.multiplier})</span>
                )}
              </div>

              {nextLevelConfig ? (
                <button
                  onClick={() => handleUpgrade(hallId)}
                  disabled={!canAfford}
                  className={`
                    w-full py-1.5 rounded text-xs font-bold transition-all duration-150
                    ${canAfford
                      ? 'bg-[rgba(201,168,76,0.15)] border border-gold text-gold hover:bg-[rgba(201,168,76,0.3)] animate-pulse-gold'
                      : 'bg-[rgba(13,27,42,0.4)] border border-[rgba(45,90,61,0.15)] text-gold-muted/40 cursor-not-allowed'
                    }
                  `}
                >
                  Ascend to Level {nextLevelConfig.level} ({nextLevelConfig.hsCost} HS)
                </button>
              ) : (
                <div className="text-xs text-gold font-bold text-center py-1.5">
                  Mandate Perfected
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
