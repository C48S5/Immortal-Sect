import { useGameStore } from '@state/gameStore';
import { useHallStore } from '@state/hallStore';
import { useAlchemyStore } from '@state/alchemyStore';
import { useMissionStore } from '@state/missionStore';
import { formatNumber, D } from '@core/BigNumber';
import type { AlchemyItemConfig } from '@models/alchemy';
import { ALCHEMY_ITEM_CONFIGS } from '@data/alchemyConfigs';

export function AlchemyPanel() {
  const alchemyEssence = useGameStore((s) => s.alchemyEssence);
  const activeDaoPath = useGameStore((s) => s.activeDaoPath);
  const hall3Level = useHallStore((s) => s.halls[3]?.level ?? 0);

  // Alchemy Dao (id "2") passive: -20% AE cost
  const isAlchemyDaoActive = activeDaoPath === '2';
  const alchemyCostReduction = isAlchemyDaoActive ? 0.20 : 0;
  const activeBuffs = useAlchemyStore((s) => s.activeBuffs);
  const addBuff = useAlchemyStore((s) => s.addBuff);

  const handleCraft = (item: AlchemyItemConfig) => {
    const effectiveCost = D(item.aeCost * (1 - alchemyCostReduction));
    if (alchemyEssence.lt(effectiveCost)) return;

    // Spend AE by adding a negative amount
    useGameStore.getState().addAE(effectiveCost.neg());

    addBuff({
      itemId: item.id,
      remainingSeconds: item.durationSeconds,
      multiplier: item.multiplier,
      affectedHallIds: item.affectedHallIds,
    });
    useMissionStore.getState().addProgress('craftPills', 1);
  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-header">Alchemy Pavilion</h2>
        <div className="currency-pill">
          <span className="currency-dot" style={{ color: '#c9a84c', backgroundColor: '#c9a84c' }} />
          <span className="currency-label">AE</span>
          <span className="currency-value">{formatNumber(alchemyEssence)}</span>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Crafting grid */}
        <div className="flex-1 space-y-2">
          {ALCHEMY_ITEM_CONFIGS.map((item) => {
            const isUnlocked = hall3Level >= item.unlockLevel;
            const effectiveItemCost = item.aeCost * (1 - alchemyCostReduction);
            const canAfford = alchemyEssence.gte(D(effectiveItemCost));
            const isActive = activeBuffs.some((b) => b.itemId === item.id);

            return (
              <div
                key={item.id}
                className={`
                  p-3 rounded-lg border transition-all duration-200
                  bg-[rgba(13,27,42,0.85)] border-[rgba(45,90,61,0.3)]
                  ${!isUnlocked ? 'opacity-40' : ''}
                  ${isActive ? 'border-success' : ''}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-warm-white">{item.name}</h3>
                      {isActive && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[rgba(76,175,80,0.2)] text-success">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gold-muted">{item.effectDescription}</p>
                    {!isUnlocked && (
                      <p className="text-xs text-crimson mt-1">
                        Requires Alchemy Furnace Level {item.unlockLevel}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleCraft(item)}
                    disabled={!isUnlocked || !canAfford || isActive}
                    className={`
                      ml-3 px-4 py-2 rounded text-xs font-bold transition-all duration-150
                      ${canAfford && isUnlocked && !isActive
                        ? 'bg-[rgba(201,168,76,0.15)] border border-gold text-gold hover:bg-[rgba(201,168,76,0.3)] animate-pulse-gold'
                        : 'bg-[rgba(13,27,42,0.4)] border border-[rgba(45,90,61,0.15)] text-gold-muted/40 cursor-not-allowed'
                      }
                    `}
                  >
                    <div>Craft</div>
                    <div className="font-mono">
                      {alchemyCostReduction > 0 ? (
                        <>
                          <span className="line-through text-gold-muted/40 mr-1">{item.aeCost}</span>
                          <span className="text-success">{Math.round(item.aeCost * (1 - alchemyCostReduction))}</span>
                        </>
                      ) : (
                        item.aeCost
                      )} AE
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active buffs sidebar */}
        <div className="w-48 shrink-0">
          <h3 className="text-sm font-bold text-gold-muted mb-2">Active Elixirs</h3>
          {activeBuffs.length === 0 ? (
            <p className="text-xs text-gold-muted/50">No elixirs brewing</p>
          ) : (
            <div className="space-y-2">
              {activeBuffs.map((buff) => {
                const item = ALCHEMY_ITEM_CONFIGS.find((i) => i.id === buff.itemId);
                return (
                  <div
                    key={`${buff.itemId}-${buff.remainingSeconds}`}
                    className="p-2 rounded bg-[rgba(76,175,80,0.1)] border border-[rgba(76,175,80,0.3)]"
                  >
                    <div className="text-xs font-bold text-success">{item?.name}</div>
                    <div className="text-xs text-gold-muted">x{buff.multiplier}</div>
                    <div className="text-xs font-mono text-warm-white">{buff.remainingSeconds}s</div>
                    <div className="w-full h-1 rounded-full bg-[rgba(13,27,42,0.6)] mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#4caf50] transition-all duration-1000"
                        style={{
                          width: `${(buff.remainingSeconds / (item?.durationSeconds ?? 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
