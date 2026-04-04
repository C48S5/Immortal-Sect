import { useState, useEffect } from 'react';
import { SpiritualRoot } from '@models/disciple';
import { SECRET_REALM_CONFIGS, IDLE_FARMING_TIERS, REALM_KEY_CONFIG } from '@data/secretRealmConfigs';
import { useDungeonStore } from '@state/dungeonStore';

const ELEMENT_COLORS: Record<SpiritualRoot, string> = {
  [SpiritualRoot.Fire]: '#8b2500',
  [SpiritualRoot.Water]: '#1a4a7a',
  [SpiritualRoot.Wood]: '#2d5a3d',
  [SpiritualRoot.Metal]: '#808080',
  [SpiritualRoot.Earth]: '#a89660',
};

type SubTab = 'idle' | 'push' | 'realms';

export function DungeonPanel() {
  const [subTab, setSubTab] = useState<SubTab>('realms');
  const [selectedRealm, setSelectedRealm] = useState<string | null>(null);

  const realms = useDungeonStore((s) => s.realms);
  const initRealms = useDungeonStore((s) => s.initRealms);
  const pushFloor = useDungeonStore((s) => s.pushFloor);
  const retreat = useDungeonStore((s) => s.retreat);
  const collectIdleRewards = useDungeonStore((s) => s.collectIdleRewards);

  useEffect(() => {
    if (Object.keys(realms).length === 0) {
      initRealms();
    }
  }, [realms, initRealms]);

  const tabs: { key: SubTab; label: string }[] = [
    { key: 'realms', label: 'Realm Select' },
    { key: 'idle', label: 'Idle Farming' },
    { key: 'push', label: 'Push Attempt' },
  ];

  const selected = selectedRealm ? SECRET_REALM_CONFIGS.find((r) => r.id === selectedRealm) : null;
  const selectedState = selectedRealm ? realms[selectedRealm] ?? null : null;

  /** Find the best idle farming tier for a given floor */
  const getIdleTier = (highestFloor: number) => {
    let best = null;
    for (const tier of IDLE_FARMING_TIERS) {
      if (highestFloor >= tier.minFloor) best = tier;
    }
    return best;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-[#c9a84c] mb-2">Secret Realms</h2>
      <p className="text-xs text-[#a89660] mb-4">
        Keys: {REALM_KEY_CONFIG.maxDailyKeys}/day | Regen: 1 every {REALM_KEY_CONFIG.regenHours}h | Cap: {REALM_KEY_CONFIG.maxStoredKeys}
      </p>

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
        {/* Realm Select */}
        {subTab === 'realms' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SECRET_REALM_CONFIGS.map((realm) => {
              const state = realms[realm.id];
              const isSelected = selectedRealm === realm.id;

              return (
                <button
                  key={realm.id}
                  onClick={() => setSelectedRealm(realm.id)}
                  className={`
                    p-4 rounded-lg border-2 text-left transition-all duration-200
                    bg-[rgba(13,27,42,0.6)]
                    ${isSelected ? 'shadow-[0_0_15px_rgba(201,168,76,0.3)]' : 'hover:border-[rgba(45,90,61,0.6)]'}
                  `}
                  style={{ borderColor: isSelected ? ELEMENT_COLORS[realm.element] : 'rgba(45,90,61,0.3)' }}
                >
                  <h3 className="text-sm font-bold" style={{ color: ELEMENT_COLORS[realm.element] }}>
                    {realm.name}
                  </h3>
                  <p className="text-xs text-[#a89660] capitalize mb-1">{realm.element} Realm</p>
                  <p className="text-[10px] text-[#a89660]">{realm.environmentalEffect}</p>
                  <div className="mt-2 text-xs text-[#e8dcc8]">
                    Highest Floor: {state?.highestFloorEver ?? 0} / {realm.totalFloors}
                  </div>
                  <div className="text-xs text-[#a89660]">
                    Keys: {state?.realmKeys ?? 0}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Idle Farming */}
        {subTab === 'idle' && (
          <div>
            {!selected ? (
              <p className="text-sm text-[#a89660] text-center py-8">
                Select a realm first from the Realm Select tab.
              </p>
            ) : (
              <div>
                <h3 className="text-sm font-bold text-[#e8dcc8] mb-3">
                  Idle Farming: {selected.name}
                </h3>
                <div className="space-y-3">
                  {(() => {
                    const tier = getIdleTier(selectedState?.highestFloorEver ?? 0);
                    return (
                      <div className="p-3 rounded bg-[rgba(13,27,42,0.6)] border border-[rgba(45,90,61,0.2)]">
                        <div className="text-xs text-[#a89660] mb-1">
                          Rewards per hour (based on highest floor{tier ? `, tier: floor ${tier.minFloor}+` : ''})
                        </div>
                        {tier ? (
                          <div className="grid grid-cols-3 gap-2 text-xs text-center">
                            <div>
                              <span className="text-[#2d5a3d]">SS</span>
                              <span className="text-[#e8dcc8] ml-1">{tier.ssPerHour.toString()}/hr</span>
                            </div>
                            <div>
                              <span className="text-[#1a7a6d]">RT</span>
                              <span className="text-[#e8dcc8] ml-1">{tier.rtPerHour}/hr</span>
                            </div>
                            <div>
                              <span className="text-[#c9a84c]">AE</span>
                              <span className="text-[#e8dcc8] ml-1">{tier.aePerHour}/hr</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-[#a89660]">Clear floor {IDLE_FARMING_TIERS[0]?.minFloor ?? 10}+ to unlock idle rewards.</p>
                        )}
                      </div>
                    );
                  })()}

                  {/* 12h reward cap bar */}
                  <div>
                    <div className="text-xs text-[#a89660] mb-1">
                      Accumulated: {((selectedState?.uncollectedIdleHours ?? 0)).toFixed(1)}h / {REALM_KEY_CONFIG.maxIdleHours}h
                    </div>
                    <div className="w-full h-2 rounded-full bg-[rgba(13,27,42,0.6)] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#1a7a6d] transition-all duration-300"
                        style={{ width: `${Math.min(((selectedState?.uncollectedIdleHours ?? 0) / REALM_KEY_CONFIG.maxIdleHours) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => selectedRealm && collectIdleRewards(selectedRealm)}
                    disabled={!selectedState || selectedState.uncollectedIdleHours <= 0}
                    className={`
                      w-full py-2 rounded-lg text-sm font-bold transition-all
                      ${selectedState && selectedState.uncollectedIdleHours > 0
                        ? 'bg-[rgba(26,122,109,0.15)] border border-[#1a7a6d] text-[#1a7a6d] hover:bg-[rgba(26,122,109,0.3)]'
                        : 'bg-[rgba(13,27,42,0.4)] border border-[rgba(45,90,61,0.15)] text-[#a89660]/40 cursor-not-allowed'
                      }
                    `}
                  >
                    Collect Idle Rewards
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Push Attempt */}
        {subTab === 'push' && (
          <div>
            {!selected ? (
              <p className="text-sm text-[#a89660] text-center py-8">
                Select a realm first from the Realm Select tab.
              </p>
            ) : (
              <div>
                <h3 className="text-sm font-bold text-[#e8dcc8] mb-3">
                  Push: {selected.name}
                </h3>

                <div className="p-3 rounded bg-[rgba(13,27,42,0.6)] border border-[rgba(45,90,61,0.2)] mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#a89660]">Current Floor</span>
                    <span className="text-sm font-bold text-[#e8dcc8]">
                      {(selectedState?.highestFloorThisRun ?? 0) + 1}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#a89660]">Highest Cleared</span>
                    <span className="text-sm text-[#c9a84c]">{selectedState?.highestFloorEver ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#a89660]">Realm Keys</span>
                    <span className="text-sm text-[#1a7a6d]">{selectedState?.realmKeys ?? 0}</span>
                  </div>

                  {/* Boss warning */}
                  {((selectedState?.highestFloorThisRun ?? 0) + 1) % 10 === 0 && (
                    <div className="mt-2 p-1.5 rounded bg-[rgba(139,37,0,0.15)] border border-[rgba(139,37,0,0.3)]">
                      <span className="text-xs text-[#8b2500] font-bold">Boss Floor!</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => selectedRealm && pushFloor(selectedRealm)}
                    disabled={(selectedState?.realmKeys ?? 0) <= 0}
                    className={`
                      flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200
                      ${(selectedState?.realmKeys ?? 0) > 0
                        ? 'bg-[rgba(45,90,61,0.15)] border border-[#2d5a3d] text-[#2d5a3d] hover:bg-[rgba(45,90,61,0.3)]'
                        : 'bg-[rgba(13,27,42,0.4)] border border-[rgba(45,90,61,0.15)] text-[#a89660]/40 cursor-not-allowed'
                      }
                    `}
                  >
                    Push Next Floor
                  </button>
                  <button
                    onClick={() => selectedRealm && retreat(selectedRealm)}
                    className="flex-1 py-2 rounded-lg text-sm font-bold bg-[rgba(139,37,0,0.15)] border border-[#8b2500] text-[#8b2500] hover:bg-[rgba(139,37,0,0.3)] transition-all"
                  >
                    Retreat
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
