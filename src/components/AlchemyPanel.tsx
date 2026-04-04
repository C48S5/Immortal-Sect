import { useGameStore } from '@state/gameStore';
import { useHallStore } from '@state/hallStore';
import { useAlchemyStore } from '@state/alchemyStore';
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
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#c9a84c]">Alchemy Pavilion</h2>
        <div className="flex items-center gap-2 px-3 py-1 rounded bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#c9a84c]" />
          <span className="text-sm font-mono text-[#c9a84c]">{formatNumber(alchemyEssence)} AE</span>
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
                  ${isActive ? 'border-[#4caf50]' : ''}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#e8dcc8]">{item.name}</h3>
                      {isActive && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[rgba(76,175,80,0.2)] text-[#4caf50]">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#a89660]">{item.effectDescription}</p>
                    {!isUnlocked && (
                      <p className="text-xs text-[#8b2500] mt-1">
                        Requires Alchemy Furnace Lv {item.unlockLevel}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleCraft(item)}
                    disabled={!isUnlocked || !canAfford || isActive}
                    className={`
                      ml-3 px-4 py-2 rounded text-xs font-bold transition-all duration-150
                      ${canAfford && isUnlocked && !isActive
                        ? 'bg-[rgba(201,168,76,0.15)] border border-[#c9a84c] text-[#c9a84c] hover:bg-[rgba(201,168,76,0.3)] animate-pulse-gold'
                        : 'bg-[rgba(13,27,42,0.4)] border border-[rgba(45,90,61,0.15)] text-[#a89660]/40 cursor-not-allowed'
                      }
                    `}
                  >
                    <div>Craft</div>
                    <div className="font-mono">
                      {alchemyCostReduction > 0 ? (
                        <>
                          <span className="line-through text-[#a89660]/40 mr-1">{item.aeCost}</span>
                          <span className="text-[#4caf50]">{Math.round(item.aeCost * (1 - alchemyCostReduction))}</span>
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
          <h3 className="text-sm font-bold text-[#a89660] mb-2">Active Buffs</h3>
          {activeBuffs.length === 0 ? (
            <p className="text-xs text-[#a89660]/50">No active buffs</p>
          ) : (
            <div className="space-y-2">
              {activeBuffs.map((buff) => {
                const item = ALCHEMY_ITEM_CONFIGS.find((i) => i.id === buff.itemId);
                return (
                  <div
                    key={`${buff.itemId}-${buff.remainingSeconds}`}
                    className="p-2 rounded bg-[rgba(76,175,80,0.1)] border border-[rgba(76,175,80,0.3)]"
                  >
                    <div className="text-xs font-bold text-[#4caf50]">{item?.name}</div>
                    <div className="text-xs text-[#a89660]">x{buff.multiplier}</div>
                    <div className="text-xs font-mono text-[#e8dcc8]">{buff.remainingSeconds}s</div>
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
