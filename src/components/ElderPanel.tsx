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
    <div className="p-4">
      <h2 className="text-xl font-bold text-[#c9a84c] mb-4">Council of Elders</h2>
      <p className="text-sm text-[#a89660] mb-4">
        Hire elders to automate your cultivation halls. Each elder runs their assigned hall
        continuously without manual intervention.
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
                relative p-3 rounded-lg border transition-all duration-200
                bg-[rgba(13,27,42,0.85)] border-[rgba(45,90,61,0.3)]
                ${isHired ? 'border-[#2d5a3d]' : ''}
                ${!isUnlocked ? 'opacity-50' : ''}
              `}
            >
              {/* Lock overlay */}
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] rounded-lg z-10">
                  <span className="text-2xl">&#x1F512;</span>
                </div>
              )}

              {/* Elder info */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-[#e8dcc8]">{config.name}</h3>
                  <p className="text-xs text-[#a89660] italic">{config.title}</p>
                </div>
                {isHired && (
                  <span className="text-lg text-[#4caf50]">&#10004;</span>
                )}
              </div>

              <p className="text-xs text-[#a89660] mb-2">
                Automates: {HALL_CONFIGS[config.id - 1]?.name ?? `Hall ${config.id}`}
              </p>

              {isHired ? (
                <div className="text-xs text-[#3d7a52] font-bold py-1.5 text-center rounded bg-[rgba(45,90,61,0.15)]">
                  Active — Hall is automated
                </div>
              ) : (
                <button
                  onClick={() => handleHire(config.id)}
                  disabled={!isUnlocked || !canAfford}
                  className={`
                    w-full py-1.5 rounded text-xs font-bold transition-all duration-150
                    ${canAfford && isUnlocked
                      ? 'bg-[rgba(201,168,76,0.15)] border border-[#c9a84c] text-[#c9a84c] hover:bg-[rgba(201,168,76,0.3)] animate-pulse-gold'
                      : 'bg-[rgba(13,27,42,0.4)] border border-[rgba(45,90,61,0.15)] text-[#a89660]/40 cursor-not-allowed'
                    }
                  `}
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
