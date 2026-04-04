import { usePrestigeStore } from '@state/prestigeStore';
import { HDP_SHOP_CONFIGS } from '@data/hdpShopConfigs';
import type { HdpShopUpgradeConfig } from '@data/hdpShopConfigs';

export function HdpShopPanel() {
  const totalHDP = usePrestigeStore((s) => s.totalHDP);
  const spentHDP = usePrestigeStore((s) => s.spentHDP);
  const hdpShopPurchases = usePrestigeStore((s) => s.hdpShopPurchases);

  const availableHDP = totalHDP - spentHDP;

  // HDP passive multiplier: 1 + (totalHDP - spentHDP) * 0.02  (+2% per unspent HDP)
  const passiveMultiplier = 1 + Math.max(0, availableHDP) * 0.02;

  const handlePurchase = (upgrade: HdpShopUpgradeConfig) => {
    const itemId = String(upgrade.id);
    if ((hdpShopPurchases[itemId] ?? 0) > 0) return;
    usePrestigeStore.getState().purchaseHDPShopItem(itemId, upgrade.hdpCost);
  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-header">Empyrean Exchange</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)]">
            <span className="w-2.5 h-2.5 rounded-full bg-gold" />
            <span className="text-sm font-mono text-gold">{availableHDP} / {totalHDP} HDP</span>
          </div>
          <div className="text-xs text-gold-muted">
            Passive: <span className="text-gold font-bold">x{passiveMultiplier.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mb-4 p-2 rounded bg-[rgba(139,37,0,0.1)] border border-[rgba(139,37,0,0.3)]">
        <p className="text-xs text-crimson">
          Caution: Each spent point diminishes your passive Dao resonance.
          Unspent points grant +2% to all income.
        </p>
      </div>

      <div className="space-y-2">
        {HDP_SHOP_CONFIGS.map((upgrade) => {
          const itemId = String(upgrade.id);
          const isPurchased = (hdpShopPurchases[itemId] ?? 0) > 0;
          const canAfford = availableHDP >= upgrade.hdpCost;

          return (
            <div
              key={upgrade.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border transition-all duration-200
                bg-[rgba(13,27,42,0.85)]
                ${isPurchased ? 'border-success opacity-70' : 'border-[rgba(45,90,61,0.3)]'}
              `}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-warm-white">{upgrade.name}</h3>
                  {isPurchased && <span className="text-success">&#10004;</span>}
                </div>
                <p className="text-xs text-gold-muted">{upgrade.effectDescription}</p>
              </div>

              {isPurchased ? (
                <span className="text-xs text-success font-bold px-3">Attained</span>
              ) : (
                <button
                  onClick={() => handlePurchase(upgrade)}
                  disabled={!canAfford}
                  className={`
                    ml-3 px-4 py-2 rounded text-xs font-bold transition-all duration-150
                    ${canAfford
                      ? 'bg-[rgba(201,168,76,0.15)] border border-gold text-gold hover:bg-[rgba(201,168,76,0.3)]'
                      : 'bg-[rgba(13,27,42,0.4)] border border-[rgba(45,90,61,0.15)] text-gold-muted/40 cursor-not-allowed'
                    }
                  `}
                >
                  {upgrade.hdpCost} HDP
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
