import { usePrestigeStore } from '@state/prestigeStore';
import { getAutomationTiers } from '@systems/AutomationSystem';
import type { AutoTier } from '@systems/AutomationSystem';

const TIERS = getAutomationTiers();

export function AutomationPanel() {
  const totalHDP = usePrestigeStore((s) => s.totalHDP);
  const spentHDP = usePrestigeStore((s) => s.spentHDP);
  const hdp = totalHDP - spentHDP;

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-header">Automation Pavilion</h2>
        <div className="flex items-center gap-2 px-3 py-1 rounded bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)]">
          <span className="w-2.5 h-2.5 rounded-full bg-gold" />
          <span className="text-sm font-mono text-gold">{hdp} HDP</span>
        </div>
      </div>

      <p className="text-xs text-gold-muted mb-4">
        Spend Heavenly Dao Points to unlock progressive automation.
        Each tier activates automatically once unlocked.
      </p>

      <div className="space-y-2">
        {TIERS.map((tier) => {
          const isUnlocked = hdp >= tier.hdpThreshold && tier.type !== 'disabled';
          const isDisabled = tier.type === 'disabled';
          const isNext = !isUnlocked && !isDisabled && TIERS.filter(t =>
            hdp >= t.hdpThreshold && t.type !== 'disabled'
          ).length === tier.id - 1;

          return (
            <AutomationTierRow
              key={tier.id}
              tier={tier}
              isUnlocked={isUnlocked}
              isDisabled={isDisabled}
              isNext={isNext}
              currentHDP={hdp}
            />
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-5 p-3 rounded bg-[rgba(10,15,26,0.6)] border border-[rgba(45,90,61,0.2)]">
        <div className="text-[10px] text-gold-muted tracking-widest uppercase mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
          Active Automations
        </div>
        <div className="text-xs text-warm-white">
          {TIERS.filter(t => hdp >= t.hdpThreshold && t.type !== 'disabled').length} / {TIERS.length - 1} unlocked
        </div>
      </div>
    </div>
  );
}

function AutomationTierRow({
  tier,
  isUnlocked,
  isDisabled,
  isNext,
  currentHDP,
}: {
  tier: AutoTier;
  isUnlocked: boolean;
  isDisabled: boolean;
  isNext: boolean;
  currentHDP: number;
}) {
  const progress = isNext ? Math.min((currentHDP / tier.hdpThreshold) * 100, 99) : 0;

  return (
    <div
      className={`
        flex items-center justify-between p-3 rounded-lg border transition-all duration-200
        bg-[rgba(13,27,42,0.85)]
        ${isUnlocked ? 'border-success opacity-90' : ''}
        ${isNext ? 'border-[rgba(201,168,76,0.5)]' : ''}
        ${isDisabled ? 'border-[rgba(139,37,0,0.3)] opacity-50' : ''}
        ${!isUnlocked && !isNext && !isDisabled ? 'border-[rgba(45,90,61,0.2)] opacity-60' : ''}
      `}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {isUnlocked && <span className="text-success">&#10004;</span>}
          {isDisabled && <span className="text-crimson">&#10006;</span>}
          {!isUnlocked && !isDisabled && (
            <span className="text-gold-muted text-xs">&#9679;</span>
          )}
          <h3 className="text-sm font-bold text-warm-white">{tier.description}</h3>
        </div>
        {isNext && (
          <div className="mt-1.5">
            <div className="w-full h-1 rounded-full bg-[rgba(10,15,26,0.6)] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#a89660] to-[#c9a84c] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-[10px] text-gold-muted mt-0.5">
              {currentHDP} / {tier.hdpThreshold} HDP
            </div>
          </div>
        )}
      </div>

      <div className="ml-3 text-right">
        {isUnlocked ? (
          <span className="text-xs text-success font-bold">Active</span>
        ) : isDisabled ? (
          <span className="text-xs text-crimson">Disabled</span>
        ) : (
          <span className="text-xs text-gold-muted font-mono">{tier.hdpThreshold} HDP</span>
        )}
      </div>
    </div>
  );
}
