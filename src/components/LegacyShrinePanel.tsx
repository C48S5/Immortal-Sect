import { useGameStore } from '@state/gameStore';
import { useLegacyStore } from '@state/legacyStore';
import { QI_RESIDUE_SHOP_CONFIGS } from '@data/qiResidueShopConfigs';

export function LegacyShrinePanel() {
  const qiResidue = useGameStore((s) => s.qiResidue);
  const legacyPower = useGameStore((s) => s.legacyPower);

  const legacyMultiplier = 1 + Math.log10(1 + legacyPower) * 0.5;

  const fragments = useLegacyStore((s) => s.fragments);
  const qrShopPurchases = useLegacyStore((s) => s.qrShopPurchases);
  const buyQRShopBuff = useLegacyStore((s) => s.buyQRShopBuff);

  const handleBuyBuff = (buffId: string) => {
    buyQRShopBuff(buffId);
  };

  return (
    <div className="p-5">
      <h2 className="section-header mb-3">Legacy Shrine</h2>

      {/* Legacy Power display */}
      <div className="flex items-center gap-4 mb-4">
        <div className="px-3 py-1 rounded bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)]">
          <span className="text-xs text-gold-muted">Legacy Power: </span>
          <span className="text-sm font-bold text-gold">{legacyPower}</span>
        </div>
        <div className="px-3 py-1 rounded bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)]">
          <span className="text-xs text-gold-muted">Global Mult: </span>
          <span className="text-sm font-bold text-gold">x{legacyMultiplier.toFixed(2)}</span>
        </div>
        <div className="px-3 py-1 rounded bg-[rgba(128,128,128,0.1)] border border-[rgba(128,128,128,0.3)]">
          <span className="text-xs text-gold-muted">QR: </span>
          <span className="text-sm font-mono text-[#808080]">{qiResidue}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Memorial Wall */}
        <div>
          <h3 className="text-sm font-bold text-gold-muted mb-2">Memorial Wall</h3>
          {fragments.length === 0 ? (
            <div className="p-6 rounded-lg bg-[rgba(13,27,42,0.6)] border border-[rgba(45,90,61,0.2)] text-center">
              <p className="text-sm text-gold-muted/50">
                No spirit tablets yet. When disciples fall, their legacy endures upon this wall.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {fragments.map((frag, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg border-2 text-center transition-all duration-200 bg-[rgba(13,27,42,0.6)] border-[rgba(45,90,61,0.3)]"
                >
                  <div className="text-lg mb-1">&#128591;</div>
                  <h4 className="text-xs font-bold text-warm-white">{frag.discipleName}</h4>
                  <p className="text-[10px] text-gold-muted capitalize">{frag.type}</p>
                  <p className="text-[10px] text-gold">LP: +{frag.legacyPower}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Qi Residue Shop */}
        <div>
          <h3 className="text-sm font-bold text-gold-muted mb-2">Qi Residue Exchange</h3>
          <div className="space-y-2">
            {QI_RESIDUE_SHOP_CONFIGS.map((config) => {
              const currentPurchases = qrShopPurchases[config.id] ?? 0;
              const canAfford = qiResidue >= config.cost;
              const maxed = currentPurchases >= config.maxPurchases;

              return (
                <div
                  key={config.id}
                  className="flex items-center justify-between p-2 rounded bg-[rgba(13,27,42,0.6)] border border-[rgba(45,90,61,0.2)]"
                >
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-warm-white">{config.name}</h4>
                    <p className="text-[10px] text-gold-muted">{config.effectDescription}</p>
                    <p className="text-[10px] text-gold-muted">
                      {currentPurchases}/{config.maxPurchases}
                    </p>
                  </div>
                  <button
                    onClick={() => handleBuyBuff(config.id)}
                    disabled={!canAfford || maxed}
                    className={`
                      ml-2 px-3 py-1.5 rounded text-xs font-bold transition-all duration-150
                      ${canAfford && !maxed
                        ? 'bg-[rgba(128,128,128,0.15)] border border-[#808080] text-[#808080] hover:bg-[rgba(128,128,128,0.3)]'
                        : 'bg-[rgba(13,27,42,0.4)] border border-[rgba(45,90,61,0.15)] text-gold-muted/40 cursor-not-allowed'
                      }
                    `}
                  >
                    {maxed ? 'Mastered' : `${config.cost} QR`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
