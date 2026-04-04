import { useState } from 'react';
import { useGameStore } from '@state/gameStore';
import { useDiscipleStore } from '@state/discipleStore';
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
    <div className="p-4">
      <h2 className="text-xl font-bold text-[#c9a84c] mb-4">Disciples</h2>

      {/* Sub-tabs */}
      <div className="flex gap-1 mb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className={`
              px-4 py-1.5 rounded-t text-sm font-bold transition-all duration-150
              ${subTab === t.key
                ? 'bg-[rgba(13,27,42,0.85)] border border-b-0 border-[rgba(45,90,61,0.3)] text-[#c9a84c]'
                : 'bg-transparent text-[#a89660] hover:text-[#e8dcc8]'
              }
            `}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4 rounded-lg bg-[rgba(13,27,42,0.85)] border border-[rgba(45,90,61,0.3)]">
        {/* Roster tab */}
        {subTab === 'roster' && (
          <div>
            {roster.length === 0 ? (
              <p className="text-sm text-[#a89660] text-center py-8">
                No disciples yet. Visit the Summon tab to recruit.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {roster.map((disc) => {
                  const config = configMap.get(disc.configId) ?? DISCIPLE_CONFIGS[0];
                  return (
                    <div
                      key={disc.instanceId}
                      className={`
                        p-3 rounded-lg border-2 transition-all duration-200
                        bg-[rgba(13,27,42,0.6)]
                        ${RARITY_BORDER[config.rarity]}
                      `}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-bold ${RARITY_TEXT[config.rarity]}`}>
                          {config.name}
                        </h3>
                        <span className="text-xs text-[#a89660]">{config.chineseName}</span>
                      </div>
                      <div className="text-xs text-[#a89660] mb-1 capitalize">{config.rarity} | {config.root}</div>
                      <div className="grid grid-cols-4 gap-1 text-xs text-center mb-2">
                        <div><span className="text-[#a89660]">HP</span> <span className="text-[#e8dcc8]">{config.stats.hp}</span></div>
                        <div><span className="text-[#a89660]">ATK</span> <span className="text-[#e8dcc8]">{config.stats.atk}</span></div>
                        <div><span className="text-[#a89660]">DEF</span> <span className="text-[#e8dcc8]">{config.stats.def}</span></div>
                        <div><span className="text-[#a89660]">SPD</span> <span className="text-[#e8dcc8]">{config.stats.spd}</span></div>
                      </div>
                      <p className="text-[10px] text-[#a89660]">{config.hallPassive.description}</p>
                      {!disc.alive && (
                        <div className="mt-1 text-xs text-[#8b2500] font-bold">Fallen</div>
                      )}
                      {/* Injury tracking not yet in store */}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Summon tab */}
        {subTab === 'summon' && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1a7a6d]" />
              <span className="text-sm font-mono text-[#1a7a6d]">{recruitmentTokens} RT</span>
            </div>

            <h3 className="text-lg font-bold text-[#e8dcc8] mb-4">Open Sect Gates</h3>

            {pullAnimation && (
              <div className="mb-4 animate-fade-in">
                <div className="w-16 h-16 mx-auto rounded-full bg-[rgba(201,168,76,0.2)] border-2 border-[#c9a84c] animate-pulse-gold" />
                <p className="text-sm text-[#c9a84c] mt-2">Summoning...</p>
              </div>
            )}

            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => handlePull(1)}
                disabled={recruitmentTokens < GACHA_CONFIG.singlePullCost || pullAnimation}
                className={`
                  px-8 py-3 rounded-lg font-bold transition-all duration-200
                  ${recruitmentTokens >= GACHA_CONFIG.singlePullCost
                    ? 'bg-[rgba(201,168,76,0.15)] border-2 border-[#c9a84c] text-[#c9a84c] hover:bg-[rgba(201,168,76,0.3)]'
                    : 'bg-[rgba(13,27,42,0.4)] border-2 border-[rgba(45,90,61,0.15)] text-[#a89660]/40 cursor-not-allowed'
                  }
                `}
              >
                <div>x1 Pull</div>
                <div className="text-xs font-mono">{GACHA_CONFIG.singlePullCost} RT</div>
              </button>
              <button
                onClick={() => handlePull(10)}
                disabled={recruitmentTokens < GACHA_CONFIG.tenPullCost || pullAnimation}
                className={`
                  px-8 py-3 rounded-lg font-bold transition-all duration-200
                  ${recruitmentTokens >= GACHA_CONFIG.tenPullCost
                    ? 'bg-[rgba(201,168,76,0.15)] border-2 border-[#c9a84c] text-[#c9a84c] hover:bg-[rgba(201,168,76,0.3)]'
                    : 'bg-[rgba(13,27,42,0.4)] border-2 border-[rgba(45,90,61,0.15)] text-[#a89660]/40 cursor-not-allowed'
                  }
                `}
              >
                <div>x10 Pull</div>
                <div className="text-xs font-mono">{GACHA_CONFIG.tenPullCost} RT</div>
              </button>
            </div>

            <div className="text-xs text-[#a89660] space-y-1">
              <p>Total Pulls: {totalPulls} | Pity Counter: {pullsSincePity}/{GACHA_CONFIG.hardPityPulls}</p>
              <p>Spark Progress: {totalPulls}/{GACHA_CONFIG.sparkPulls}</p>
              <p className="text-[10px]">
                Rates: {pullRatesDisplay}
              </p>
            </div>
          </div>
        )}

        {/* Assign tab */}
        {subTab === 'assign' && (
          <div>
            <p className="text-sm text-[#a89660] mb-4">
              Assign disciples to cultivation halls for passive bonuses.
            </p>
            {roster.length === 0 ? (
              <p className="text-sm text-[#a89660] text-center py-8">
                No disciples to assign. Summon some first.
              </p>
            ) : (
              <div className="space-y-2">
                {Array.from({ length: 12 }, (_, i) => {
                  const hallId = i + 1;
                  const assigned = roster.find((d) => d.assignedHallId === hallId);

                  return (
                    <div key={hallId} className="flex items-center justify-between p-2 rounded bg-[rgba(13,27,42,0.6)] border border-[rgba(45,90,61,0.2)]">
                      <span className="text-xs text-[#e8dcc8]">{HALL_CONFIGS[i]?.name ?? `Hall ${hallId}`}</span>
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
                        className="bg-[rgba(13,27,42,0.8)] border border-[rgba(45,90,61,0.3)] text-[#e8dcc8] text-xs rounded px-2 py-1"
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
