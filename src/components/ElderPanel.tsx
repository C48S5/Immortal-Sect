import { useEffect } from 'react';
import { useGameStore } from '@state/gameStore';
import { useElderStore } from '@state/elderStore';
import { useHallStore } from '@state/hallStore';
import { formatNumber } from '@core/BigNumber';
import { ELDER_CONFIGS } from '@data/elderConfigs';
import { HALL_CONFIGS } from '@data/hallConfigs';

export function ElderPanel() {
  const spiritStones = useGameStore((s) => s.spiritStones);
  const elders = useElderStore((s) => s.elders);
  const halls = useHallStore((s) => s.halls);

  // Ensure all elders are initialized in the store
  useEffect(() => {
    const { initElder, elders: currentElders } = useElderStore.getState();
    for (const config of ELDER_CONFIGS) {
      if (!currentElders[config.id]) {
        initElder(config.id);
      }
    }
  }, []);

  const handleHire = (elderId: number) => {
    const config = ELDER_CONFIGS[elderId - 1];
    if (!config) return;
    useElderStore.getState().hireElder(elderId, {
      id: config.id,
      hallId: config.hallId,
      cost: config.cost,
    });
  };

  return (
    <div className="p-5">
      <h2 className="section-header mb-2">Council of Elders</h2>
      <p className="text-sm text-gold-muted mb-5" style={{ fontFamily: "'Crimson Pro', serif" }}>
        Appoint elders to oversee your cultivation halls. Each elder maintains their hall's
        cycle without pause.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ELDER_CONFIGS.map((config) => {
          const isHired = elders[config.id]?.hired ?? false;
          const isUnlocked = halls[config.hallId]?.isUnlocked ?? false;
          const canAfford = spiritStones.gte(config.cost);

          return (
            <div
              key={config.id}
              className={`
                character-card
                ${isHired ? 'border-[rgba(45,90,61,0.4)]' : ''}
                ${!isUnlocked ? 'opacity-40' : ''}
              `}
            >
              {/* Lock overlay */}
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] rounded-lg z-10">
                  <span className="text-2xl opacity-60">&#x1F512;</span>
                </div>
              )}

              {/* Elder info */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="character-name text-warm-white">{config.name}</h3>
                  <p className="text-xs text-gold-muted italic" style={{ fontFamily: "'Crimson Pro', serif" }}>{config.title}</p>
                </div>
                {isHired && (
                  <span className="text-sm text-[#52a36d]">&#10004;</span>
                )}
              </div>

              <p className="text-[11px] text-gold-muted mb-3" style={{ fontFamily: "'Crimson Pro', serif" }}>
                Automates: <span className="text-warm-white">{HALL_CONFIGS[config.id - 1]?.name ?? `Hall ${config.id}`}</span>
              </p>

              {isHired ? (
                <div className="text-[10px] text-[#52a36d] py-1.5 text-center rounded bg-[rgba(45,90,61,0.1)] border border-[rgba(45,90,61,0.2)] tracking-wider uppercase"
                  style={{ fontFamily: "'Cinzel', serif" }}>
                  Active
                </div>
              ) : (
                <button
                  onClick={() => handleHire(config.id)}
                  disabled={!isUnlocked || !canAfford}
                  className={`w-full buy-btn ${canAfford && isUnlocked ? 'affordable' : 'disabled'}`}
                >
                  Hire — {formatNumber(config.cost)} SS
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
