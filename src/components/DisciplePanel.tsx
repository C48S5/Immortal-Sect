import { useState } from 'react';
import { useGameStore } from '@state/gameStore';
import { useDiscipleStore } from '@state/discipleStore';
import { useMissionStore } from '@state/missionStore';
import { Rarity } from '@models/disciple';
import { DISCIPLE_CONFIGS, PULL_RATES, GACHA_CONFIG } from '@data/discipleConfigs';
import { HALL_CONFIGS } from '@data/hallConfigs';

const RARITY_BORDER: Record<Rarity, string> = {
  [Rarity.Common]: 'border-rarity-common',
  [Rarity.Uncommon]: 'border-rarity-uncommon',
  [Rarity.Rare]: 'border-rarity-rare',
  [Rarity.Epic]: 'border-rarity-epic',
  [Rarity.Legendary]: 'border-rarity-legendary',
};

const RARITY_TEXT: Record<Rarity, string> = {
  [Rarity.Common]: 'text-rarity-common',
  [Rarity.Uncommon]: 'text-rarity-uncommon',
  [Rarity.Rare]: 'text-rarity-rare',
  [Rarity.Epic]: 'text-rarity-epic',
  [Rarity.Legendary]: 'text-rarity-legendary',
};

type SubTab = 'roster' | 'summon' | 'assign';

export function DisciplePanel() {
  const recruitmentTokens = useGameStore((s) => s.recruitmentTokens);
  const [subTab, setSubTab] = useState<SubTab>('roster');
  const [pullAnimation, setPullAnimation] = useState(false);

  const roster = useDiscipleStore((s) => s.roster);
  const totalPulls = useDiscipleStore((s) => s.totalPulls);
  const pullsSincePity = useDiscipleStore((s) => s.pullsSincePity);
  const pull = useDiscipleStore((s) => s.pull);
  const assignToHall = useDiscipleStore((s) => s.assignToHall);

  const configMap = new Map(DISCIPLE_CONFIGS.map((c) => [c.id, c]));

  const handlePull = (count: 1 | 10) => {
    const cost = count === 1 ? GACHA_CONFIG.singlePullCost : GACHA_CONFIG.tenPullCost;
    if (recruitmentTokens < cost) return;

    setPullAnimation(true);
    setTimeout(() => {
      pull(count);
      useMissionStore.getState().addProgress('pullDisciples', count);
      setPullAnimation(false);
    }, 800);
  };

  const tabs: { key: SubTab; label: string }[] = [
    { key: 'roster', label: 'Roster' },
    { key: 'summon', label: 'Summon' },
    { key: 'assign', label: 'Assign' },
  ];

  const pullRatesDisplay = PULL_RATES.map(
    (pr) => `${pr.rarity.charAt(0).toUpperCase() + pr.rarity.slice(1)} ${Math.round(pr.rate * 100)}%`
  ).join(' | ');

  return (
    <div className="p-5">
      <h2 className="section-header mb-4">Disciples</h2>

      {/* Sub-tabs */}
      <div className="flex gap-1 mb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className={`
              px-4 py-1.5 rounded-t text-[11px] font-semibold tracking-wider uppercase transition-all duration-150
              ${subTab === t.key
                ? 'bg-[rgba(10,15,26,0.85)] border border-b-0 border-[rgba(45,90,61,0.2)] text-gold'
                : 'bg-transparent text-gold-muted hover:text-warm-white'
              }
            `}
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="sect-panel p-4">
        {/* Roster tab */}
        {subTab === 'roster' && (
          <div>
            {roster.length === 0 ? (
              <p className="text-sm text-gold-muted text-center py-8" style={{ fontFamily: "'Crimson Pro', serif" }}>
                No disciples have joined your sect. Open the Gates to summon new followers.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {roster.map((disc) => {
                  const config = configMap.get(disc.configId) ?? DISCIPLE_CONFIGS[0];
                  return (
                    <div
                      key={disc.instanceId}
                      className={`
                        character-card border-2
                        ${RARITY_BORDER[config.rarity]}
                      `}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`character-name ${RARITY_TEXT[config.rarity]}`}>
                          {config.name}
                        </h3>
                        <span className="chinese-name">{config.chineseName}</span>
                      </div>
                      <div className="text-[10px] text-gold-muted mb-1.5 capitalize tracking-wider">{config.rarity} | {config.root}</div>
                      <div className="grid grid-cols-4 gap-1 text-center mb-2">
                        <div><span className="text-[9px] text-gold-muted block tracking-wider">HP</span> <span className="text-xs text-warm-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{config.stats.hp}</span></div>
                        <div><span className="text-[9px] text-gold-muted block tracking-wider">ATK</span> <span className="text-xs text-warm-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{config.stats.atk}</span></div>
                        <div><span className="text-[9px] text-gold-muted block tracking-wider">DEF</span> <span className="text-xs text-warm-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{config.stats.def}</span></div>
                        <div><span className="text-[9px] text-gold-muted block tracking-wider">SPD</span> <span className="text-xs text-warm-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{config.stats.spd}</span></div>
                      </div>
                      <p className="text-[10px] text-gold-muted" style={{ fontFamily: "'Crimson Pro', serif" }}>{config.hallPassive.description}</p>
                      {!disc.alive && (
                        <div className="mt-1.5 text-[10px] text-crimson tracking-wider uppercase" style={{ fontFamily: "'Cinzel', serif" }}>Fallen</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Summon tab */}
        {subTab === 'summon' && (
          <div className="text-center py-4">
            <div className="currency-pill inline-flex mx-auto mb-5">
              <span className="currency-dot" style={{ color: '#2ba695', backgroundColor: '#2ba695' }} />
              <span className="currency-label">RT</span>
              <span className="currency-value">{recruitmentTokens}</span>
            </div>

            <h3 className="section-header mx-auto mb-6" style={{ display: 'block' }}>Open Sect Gates</h3>

            {pullAnimation && (
              <div className="mb-6 animate-fade-in">
                <div className="w-20 h-20 mx-auto rounded-full bg-[rgba(201,168,76,0.1)] border-2 border-gold animate-pulse-gold flex items-center justify-center">
                  <span className="text-2xl animate-breathe">&#9775;</span>
                </div>
                <p className="text-sm text-gold mt-3 tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Summoning...</p>
              </div>
            )}

            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => handlePull(1)}
                disabled={recruitmentTokens < GACHA_CONFIG.singlePullCost || pullAnimation}
                className={`px-8 py-4 rounded-lg transition-all duration-200 ${
                  recruitmentTokens >= GACHA_CONFIG.singlePullCost
                    ? 'bg-[rgba(201,168,76,0.06)] border-2 border-[rgba(201,168,76,0.35)] text-gold hover:bg-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.6)]'
                    : 'bg-[rgba(10,15,26,0.4)] border-2 border-[rgba(45,90,61,0.1)] text-gold-muted/30 cursor-not-allowed'
                }`}
              >
                <div className="text-sm tracking-wider" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}>x1 Pull</div>
                <div className="text-xs mt-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{GACHA_CONFIG.singlePullCost} RT</div>
              </button>
              <button
                onClick={() => handlePull(10)}
                disabled={recruitmentTokens < GACHA_CONFIG.tenPullCost || pullAnimation}
                className={`px-8 py-4 rounded-lg transition-all duration-200 ${
                  recruitmentTokens >= GACHA_CONFIG.tenPullCost
                    ? 'bg-[rgba(201,168,76,0.06)] border-2 border-[rgba(201,168,76,0.35)] text-gold hover:bg-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.6)]'
                    : 'bg-[rgba(10,15,26,0.4)] border-2 border-[rgba(45,90,61,0.1)] text-gold-muted/30 cursor-not-allowed'
                }`}
              >
                <div className="text-sm tracking-wider" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}>x10 Pull</div>
                <div className="text-xs mt-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{GACHA_CONFIG.tenPullCost} RT</div>
              </button>
            </div>

            <div className="space-y-1.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#a89660' }}>
              <p>Total Pulls: {totalPulls} | Pity: {pullsSincePity}/{GACHA_CONFIG.hardPityPulls}</p>
              <p>Spark: {totalPulls}/{GACHA_CONFIG.sparkPulls}</p>
              <p className="text-[10px] text-gold-muted/60">
                {pullRatesDisplay}
              </p>
            </div>
          </div>
        )}

        {/* Assign tab */}
        {subTab === 'assign' && (
          <div>
            <p className="text-sm text-gold-muted mb-4">
              Station disciples in cultivation halls to receive their passive blessings.
            </p>
            {roster.length === 0 ? (
              <p className="text-sm text-gold-muted text-center py-8">
                No disciples available. Open the Sect Gates first.
              </p>
            ) : (
              <div className="space-y-2">
                {Array.from({ length: 12 }, (_, i) => {
                  const hallId = i + 1;
                  const assigned = roster.find((d) => d.assignedHallId === hallId);

                  return (
                    <div key={hallId} className="flex items-center justify-between p-2 rounded bg-[rgba(13,27,42,0.6)] border border-[rgba(45,90,61,0.2)]">
                      <span className="text-xs text-warm-white">{HALL_CONFIGS[i]?.name ?? `Hall ${hallId}`}</span>
                      <select
                        value={assigned?.instanceId ?? ''}
                        onChange={(e) => {
                          const discId = e.target.value;
                          // Unassign the currently assigned disciple from this hall
                          if (assigned) {
                            assignToHall(assigned.instanceId, null);
                          }
                          // Assign the new disciple to this hall
                          if (discId) {
                            assignToHall(discId, hallId);
                          }
                        }}
                        className="bg-[rgba(13,27,42,0.8)] border border-[rgba(45,90,61,0.3)] text-warm-white text-xs rounded px-2 py-1"
                      >
                        <option value="">None</option>
                        {roster
                          .filter((d) => d.alive && (d.assignedHallId === null || d.assignedHallId === hallId))
                          .map((d) => {
                            const cfg = configMap.get(d.configId);
                            return (
                              <option key={d.instanceId} value={d.instanceId}>
                                {cfg?.name ?? d.configId}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
