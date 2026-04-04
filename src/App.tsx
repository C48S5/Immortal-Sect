import { useState, useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '@state/gameStore';
import { useHallStore } from '@state/hallStore';
import { useElderStore } from '@state/elderStore';
import { usePrestigeStore } from '@state/prestigeStore';
import { useMandateStore } from '@state/mandateStore';
import { useDiscipleStore } from '@state/discipleStore';
import { useChallengeStore } from '@state/challengeStore';
import { useDungeonStore } from '@state/dungeonStore';
import { useLegacyStore } from '@state/legacyStore';
import { useAlchemyStore } from '@state/alchemyStore';
import { useDaoPathStore } from '@state/daoPathStore';
import { D, bulkCost } from '@core/BigNumber';
import { startGameLoop, stopGameLoop } from '@core/GameLoop';
import { load as loadSave, save as saveToDisk, startAutoSave, stopAutoSave } from '@core/SaveSystem';
import type { SaveGameState } from '@core/SaveSystem';
import { calculateOfflineEarnings } from '@core/OfflineCalc';
import { HALL_CONFIGS } from '@data/hallConfigs';
import { ELDER_CONFIGS } from '@data/elderConfigs';
import { CurrencyBar } from '@components/CurrencyBar';
import { SectMountain } from '@components/SectMountain';
import { ElderPanel } from '@components/ElderPanel';
import { DaoPathSelector } from '@components/DaoPathSelector';
import { AlchemyPanel } from '@components/AlchemyPanel';
import { AscensionScreen } from '@components/AscensionScreen';
import { ChallengePanel } from '@components/ChallengePanel';
import { MandatePanel } from '@components/MandatePanel';
import { HdpShopPanel } from '@components/HdpShopPanel';
import { DisciplePanel } from '@components/DisciplePanel';
import { DungeonPanel } from '@components/DungeonPanel';
import { LegacyShrinePanel } from '@components/LegacyShrinePanel';
import { HeavenlyTreasure } from '@components/HeavenlyTreasure';
import { SettingsPanel } from '@components/SettingsPanel';
import { OfflineReturnScreen } from '@components/OfflineReturnScreen';
import { getActiveMilestones, getSectHarmonyBonus, getBodyTemperingAllBonus, getAEBonusFromMilestones } from '@systems/MilestoneSystem';
import { calculateAEPerSecond } from '@systems/AlchemySystem';
import { CHALLENGE_CONFIGS } from '@data/challengeConfigs';
import Decimal from 'break_infinity.js';
import '@styles/index.css';

/** Tab definitions with unlock conditions */
interface TabDef {
  id: string;
  label: string;
  isVisible: (state: TabVisibilityState) => boolean;
}

interface TabVisibilityState {
  highestHallLevel: number;
  hasElder: boolean;
  ascensionCount: number;
  hasDisciples: boolean;
}

const TABS: TabDef[] = [
  { id: 'sect', label: 'Sect', isVisible: () => true },
  { id: 'elders', label: 'Elders', isVisible: (s) => s.highestHallLevel >= 5 },
  { id: 'alchemy', label: 'Alchemy', isVisible: (s) => s.hasElder },
  { id: 'daoPath', label: 'Dao Path', isVisible: (s) => s.ascensionCount >= 1 },
  { id: 'challenges', label: 'Challenges', isVisible: (s) => s.ascensionCount >= 1 },
  { id: 'mandate', label: 'Mandate', isVisible: (s) => s.ascensionCount >= 1 },
  { id: 'hdpShop', label: 'HDP Shop', isVisible: (s) => s.ascensionCount >= 1 },
  { id: 'disciples', label: 'Disciples', isVisible: (s) => s.hasDisciples },
  { id: 'dungeons', label: 'Dungeons', isVisible: (s) => s.hasDisciples },
  { id: 'legacy', label: 'Legacy', isVisible: (s) => s.hasDisciples },
  { id: 'settings', label: 'Settings', isVisible: () => true },
];

/** Count Void Meditation Sanctum (Hall 9) offline efficiency milestones reached */
function getVoidMeditationTier(hall9Level: number): number {
  // Hall 9 milestones with specialEffect 'offlineEfficiency' grant tiers 0-5
  const thresholds = [200, 600, 1000, 2000, 4000]; // From Hall 9 milestone configs
  let tier = 0;
  for (const t of thresholds) {
    if (hall9Level >= t) tier++;
  }
  return tier;
}

/** Track last tick's delta time for applyBuffs (which has no dt param) */
let lastDeltaTime = 0.05;

/** Fingerprint to skip milestone recomputation when hall levels haven't changed */
let lastMilestoneFingerprint = '';

/** Build hall config lookups for store operations */
const HALL_CONFIG_LOOKUPS = HALL_CONFIGS.map((c) => ({
  id: c.id,
  baseCost: c.baseCost,
  coefficient: c.coefficient,
  cycleSeconds: c.cycleSeconds,
  baseRevenue: c.baseRevenue,
}));

/** Build current SaveGameState from all stores */
function buildSaveState(): SaveGameState {
  const gs = useGameStore.getState();
  const hs = useHallStore.getState();
  const es = useElderStore.getState();
  const ps = usePrestigeStore.getState();

  const halls: SaveGameState['halls'] = {};
  for (const [id, slot] of Object.entries(hs.halls)) {
    halls[Number(id)] = {
      level: slot.level,
      cycleProgress: slot.cycleProgress,
      isAutomated: slot.isAutomated,
      isUnlocked: slot.isUnlocked,
      speedMultiplier: slot.speedMultiplier.toString(),
      profitMultiplier: slot.profitMultiplier.toString(),
    };
  }

  return {
    version: 1,
    timestamp: Date.now(),
    totalPlayTime: gs.totalPlayTime,
    ascensionCount: gs.ascensionCount,
    currentRealm: gs.currentRealm,
    activeDaoPath: gs.activeDaoPath,
    spiritStones: gs.spiritStones.toString(),
    hdp: gs.hdp,
    daoCrystals: gs.daoCrystals,
    heavenlySeals: gs.heavenlySeals,
    alchemyEssence: gs.alchemyEssence.toString(),
    recruitmentTokens: gs.recruitmentTokens,
    qiResidue: gs.qiResidue,
    legacyPower: gs.legacyPower,
    halls,
    elders: es.elders,
    mandateSlots: useMandateStore.getState().slots,
    disciples: {
      roster: useDiscipleStore.getState().roster,
      totalPulls: useDiscipleStore.getState().totalPulls,
      pullsSincePity: useDiscipleStore.getState().pullsSincePity,
    },
    challenges: useChallengeStore.getState().challenges,
    dungeonRealms: useDungeonStore.getState().realms,
    legacy: {
      fragments: useLegacyStore.getState().fragments,
      techniques: useLegacyStore.getState().techniques,
      qrShopPurchases: useLegacyStore.getState().qrShopPurchases,
    },
    totalHDP: ps.totalHDP,
    spentHDP: ps.spentHDP,
    hdpShopPurchases: ps.hdpShopPurchases,
    bestHDP: ps.ascensionHistory.bestHDP,
    fastestAscension: ps.ascensionHistory.fastestAscension,
    settings: gs.settings,
    alchemyBuffs: useAlchemyStore.getState().activeBuffs,
    daoPathSpell: {
      spellActive: useDaoPathStore.getState().spellActive,
      spellRemainingDuration: useDaoPathStore.getState().spellRemainingDuration,
      spellCooldownRemaining: useDaoPathStore.getState().spellCooldownRemaining,
    },
  };
}

/** Hydrate all stores from a save */
function hydrateSave(data: SaveGameState): void {
  // Hydrate gameStore
  useGameStore.setState({
    spiritStones: new Decimal(data.spiritStones),
    hdp: data.hdp,
    daoCrystals: data.daoCrystals,
    heavenlySeals: data.heavenlySeals,
    alchemyEssence: new Decimal(data.alchemyEssence),
    recruitmentTokens: data.recruitmentTokens,
    qiResidue: data.qiResidue,
    legacyPower: data.legacyPower,
    totalPlayTime: data.totalPlayTime,
    ascensionCount: data.ascensionCount,
    currentRealm: data.currentRealm,
    activeDaoPath: data.activeDaoPath,
    lastSaveTime: data.timestamp,
    lastTickTime: Date.now(),
    settings: data.settings ?? { soundEnabled: true, notationsStyle: 'standard' },
  });

  // Hydrate hallStore
  const hallState: Record<number, { level: number; cycleProgress: number; isAutomated: boolean; isUnlocked: boolean; speedMultiplier: Decimal; profitMultiplier: Decimal }> = {};
  for (const [id, slot] of Object.entries(data.halls)) {
    hallState[Number(id)] = {
      level: slot.level,
      cycleProgress: slot.cycleProgress,
      isAutomated: slot.isAutomated,
      isUnlocked: slot.isUnlocked,
      speedMultiplier: new Decimal(slot.speedMultiplier),
      profitMultiplier: new Decimal(slot.profitMultiplier),
    };
  }
  useHallStore.setState({ halls: hallState });

  // Hydrate elderStore
  const elderState: Record<number, { hired: boolean }> = {};
  for (const [id, slot] of Object.entries(data.elders)) {
    elderState[Number(id)] = { hired: slot.hired };
  }
  useElderStore.setState({ elders: elderState });

  // Hydrate new stores (null-checked for backwards compatibility)
  if (data.mandateSlots) useMandateStore.setState({ slots: data.mandateSlots });
  if (data.disciples) useDiscipleStore.setState(data.disciples);
  if (data.challenges) useChallengeStore.setState({ challenges: data.challenges });
  if (data.dungeonRealms) useDungeonStore.setState({ realms: data.dungeonRealms });
  if (data.legacy) useLegacyStore.setState(data.legacy);
  if (data.alchemyBuffs) useAlchemyStore.setState({ activeBuffs: data.alchemyBuffs });
  if (data.daoPathSpell) useDaoPathStore.setState(data.daoPathSpell);

  // Hydrate prestigeStore
  usePrestigeStore.setState({
    totalHDP: data.totalHDP,
    spentHDP: data.spentHDP,
    hdpShopPurchases: data.hdpShopPurchases,
    ascensionHistory: {
      count: data.ascensionCount,
      bestHDP: data.bestHDP,
      fastestAscension: data.fastestAscension,
    },
  });
}

/** Initialize hall slots for all 12 halls if they don't exist yet */
function ensureHallsInitialized(): void {
  const hs = useHallStore.getState();
  for (const config of HALL_CONFIGS) {
    if (!hs.halls[config.id]) {
      hs.initHall(config.id);
    }
  }
  // Hall 1 is always unlocked
  if (hs.halls[1] && !hs.halls[1].isUnlocked) {
    hs.unlockHall(1);
  }
}

/** Initialize elder slots for all 12 elders */
function ensureEldersInitialized(): void {
  const es = useElderStore.getState();
  for (const config of ELDER_CONFIGS) {
    if (!es.elders[config.id]) {
      es.initElder(config.id);
    }
  }
}

// Initialize stores at module level (before any React render)
ensureHallsInitialized();
ensureEldersInitialized();
useMandateStore.getState().initSlots();
useChallengeStore.getState().initChallenges();
useDungeonStore.getState().initRealms();

export default function App() {
  const [activeTab, setActiveTab] = useState('sect');
  const [showAscension, setShowAscension] = useState(false);
  const [, setGameReady] = useState(false);
  const [offlineReturn, setOfflineReturn] = useState<{
    seconds: number;
    spiritStones: Decimal;
  } | null>(null);

  // Real store subscriptions for tab visibility
  const ascensionCount = useGameStore((s) => s.ascensionCount);
  const addSpiritStones = useGameStore((s) => s.addSpiritStones);
  const halls = useHallStore((s) => s.halls);
  const elders = useElderStore((s) => s.elders);

  // Derive tab visibility state from real stores
  const highestHallLevel = Object.values(halls).reduce(
    (max, h) => Math.max(max, h.isUnlocked ? h.level : 0),
    0,
  );
  const hasElder = Object.values(elders).some((e) => e.hired);
  const hasDisciples = ascensionCount >= 2; // Disciples unlock after 2nd ascension

  // Debounced save on any store change (save-on-purchase)
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const unsubs = [
      useGameStore.subscribe(() => {
        clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => saveToDisk(buildSaveState()), 2000);
      }),
      useHallStore.subscribe(() => {
        clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => saveToDisk(buildSaveState()), 2000);
      }),
      useElderStore.subscribe(() => {
        clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => saveToDisk(buildSaveState()), 2000);
      }),
      useMandateStore.subscribe(() => {
        clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => saveToDisk(buildSaveState()), 2000);
      }),
      useDiscipleStore.subscribe(() => {
        clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => saveToDisk(buildSaveState()), 2000);
      }),
      useChallengeStore.subscribe(() => {
        clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => saveToDisk(buildSaveState()), 2000);
      }),
      useDungeonStore.subscribe(() => {
        clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => saveToDisk(buildSaveState()), 2000);
      }),
      useLegacyStore.subscribe(() => {
        clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => saveToDisk(buildSaveState()), 2000);
      }),
      useAlchemyStore.subscribe(() => {
        clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => saveToDisk(buildSaveState()), 2000);
      }),
      useDaoPathStore.subscribe(() => {
        clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => saveToDisk(buildSaveState()), 2000);
      }),
    ];
    return () => {
      clearTimeout(saveTimeout.current);
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  const tabState: TabVisibilityState = {
    highestHallLevel,
    hasElder,
    ascensionCount,
    hasDisciples,
  };

  const visibleTabs = TABS.filter((tab) => tab.isVisible(tabState));

  // === INITIALIZATION: Load save, check offline, start game loop ===
  useEffect(() => {
    // 1. Load save (halls/elders already initialized at module level)
    const savedData = loadSave();
    if (savedData) {
      hydrateSave(savedData);

      // 3. Check offline earnings
      const now = Date.now();
      const lastSave = savedData.timestamp;
      const secondsAway = (now - lastSave) / 1000;

      if (secondsAway > 60) {
        // More than 1 minute away — show offline return
        const hallStore = useHallStore.getState();
        const incomePerSecond = hallStore.getTotalRevenuePerSecond(HALL_CONFIG_LOOKUPS);

        if (incomePerSecond.gt(0)) {
          const result = calculateOfflineEarnings(
            {
              incomePerSecond,
              lastSaveTime: lastSave,
              voidMeditationTier: getVoidMeditationTier(hallStore.halls[9]?.level ?? 0),
              tribulation9Complete: useChallengeStore.getState().challenges[9]?.completed ?? false,
              bodyDaoActive: useGameStore.getState().activeDaoPath === '4',
            },
            now,
          );

          if (result.spiritStones.gt(0)) {
            setOfflineReturn({
              seconds: result.secondsAway,
              spiritStones: result.spiritStones,
            });
          }
        }
      }
    }

    // 4. Start game loop
    startGameLoop(
      {
        updateCycles: (dt) => {
          lastDeltaTime = dt;
          useHallStore.getState().tickCycles(dt, HALL_CONFIG_LOOKUPS);

          // Wire challenge earnings into revenue tracking
          const activeChallengeId = useChallengeStore.getState().getActiveChallenge();
          if (activeChallengeId !== null) {
            const revenueThisTick = useHallStore.getState().getTotalRevenuePerSecond(HALL_CONFIG_LOOKUPS).mul(dt);
            useChallengeStore.getState().addChallengeEarnings(revenueThisTick);
          }
        },
        checkMilestones: () => {
          const hs = useHallStore.getState();
          const hallLevels: number[] = [];

          for (let id = 1; id <= 12; id++) {
            hallLevels.push(hs.halls[id]?.level ?? 0);
          }

          // Build a level fingerprint to skip recomputation when nothing changed
          const fingerprint = hallLevels.join(',');
          if (fingerprint === lastMilestoneFingerprint) return;
          lastMilestoneFingerprint = fingerprint;

          // Global bonuses
          const harmony = getSectHarmonyBonus(hallLevels);
          const bodyBonus = getBodyTemperingAllBonus(hallLevels[1] ?? 0); // Hall 2 = index 1

          for (let id = 1; id <= 12; id++) {
            const hall = hs.halls[id];
            if (!hall || !hall.isUnlocked) continue;

            // Individual milestones
            const { speedMult, profitMult } = getActiveMilestones(id, hall.level);

            // Combine: individual x harmony x body tempering x mandate x challenge
            const mandateMult = useMandateStore.getState().getMandateMultiplier(id);

            let challengeSpeedMult = D(1);
            const challengeStates = useChallengeStore.getState().challenges;
            for (const [cId, cs] of Object.entries(challengeStates)) {
              if (!cs.completed) continue;
              const cc = CHALLENGE_CONFIGS.find((c) => c.id === Number(cId));
              if (cc?.rewardType === 'allSpeedMult') challengeSpeedMult = challengeSpeedMult.mul(cc.rewardValue);
            }

            const finalSpeed = speedMult.mul(harmony.speedMult).mul(challengeSpeedMult);
            const finalProfit = profitMult.mul(harmony.profitMult).mul(bodyBonus).mul(mandateMult);

            // Only update store if values actually changed (compare as strings to avoid object identity issues)
            if (hall.speedMultiplier.toString() !== finalSpeed.toString()
              || hall.profitMultiplier.toString() !== finalProfit.toString()) {
              hs.setSpeedMultiplier(id, finalSpeed);
              hs.setProfitMultiplier(id, finalProfit);
            }
          }
        },
        updateAutomation: (_dt) => {
          const ps = usePrestigeStore.getState();
          const hdp = ps.totalHDP - ps.spentHDP;
          if (hdp < 50) return;

          const hs = useHallStore.getState();
          const gs = useGameStore.getState();
          let budget = gs.spiritStones;

          // Determine hall auto-buy range based on HDP
          let hallMax = 0;
          if (hdp >= 1500) hallMax = 12;
          else if (hdp >= 500) hallMax = 6;
          else if (hdp >= 150) hallMax = 3;
          else if (hdp >= 50) hallMax = 1;

          // Auto-buy halls
          for (let id = 1; id <= hallMax; id++) {
            const hall = hs.halls[id];
            if (!hall || !hall.isUnlocked || hall.level <= 0) continue;
            const config = HALL_CONFIGS.find((c) => c.id === id);
            if (!config) continue;
            const cost = bulkCost(config.baseCost, config.coefficient, hall.level, 1);
            if (budget.gte(cost)) {
              gs.spendSpiritStones(cost);
              hs.buyHall(id, 1);
              budget = gs.spiritStones;
            }
          }

          // Auto-hire elders
          if (hdp >= 3000) {
            const es = useElderStore.getState();
            const elderMax = hdp >= 7500 ? 12 : 6;
            for (let id = 1; id <= elderMax; id++) {
              const elder = es.elders[id];
              if (!elder || elder.hired) continue;
              const ec = ELDER_CONFIGS.find((c) => c.id === id);
              if (!ec) continue;
              if (gs.spiritStones.gte(ec.cost)) {
                es.hireElder(id, { id: ec.id, hallId: ec.hallId, cost: ec.cost });
              }
            }
          }
        },
        applyBuffs: () => {
          const dt = lastDeltaTime;

          // Tick alchemy buff durations
          useAlchemyStore.getState().tickBuffs(dt);

          // Tick Dao Path spell
          useDaoPathStore.getState().tickSpell(dt);

          // AE generation: Hall 3 + Hall 5
          const hs = useHallStore.getState();
          const hall3Level = hs.halls[3]?.level ?? 0;
          const hall5Level = hs.halls[5]?.level ?? 0;
          if (hall3Level > 0 || hall5Level > 0) {
            const hallLevels: number[] = [];
            for (let i = 1; i <= 12; i++) hallLevels.push(hs.halls[i]?.level ?? 0);
            const milestoneAEBonus = getAEBonusFromMilestones(hallLevels);
            const spellAEMult = useDaoPathStore.getState().spellEffects.aeMultiplier;
            const aePerSecond = calculateAEPerSecond(hall3Level, hall5Level, milestoneAEBonus, spellAEMult);
            if (aePerSecond > 0) useGameStore.getState().addAE(D(aePerSecond * dt));
          }

          // Dungeon idle farming + key regen
          useDungeonStore.getState().tickIdleFarming(dt);
        },
      },
      () => {
        // 4Hz render callback — no forced re-render needed.
        // Zustand store updates from tickCycles already trigger
        // re-renders for subscribed components.
      },
    );

    // 5. Start auto-save
    startAutoSave(buildSaveState);

    // 6. Update lastTickTime
    useGameStore.getState().setLastTickTime(Date.now());

    setGameReady(true);

    return () => {
      stopGameLoop();
      stopAutoSave();
      // Final save on unmount
      saveToDisk(buildSaveState());
    };
  }, []);

  const handleOfflineCollect = useCallback(
    (multiplier: number) => {
      if (offlineReturn) {
        addSpiritStones(offlineReturn.spiritStones.mul(multiplier));
        setOfflineReturn(null);
      }
    },
    [offlineReturn, addSpiritStones],
  );

  const handleTreasureCollect = useCallback(() => {
    // Award bonus SS proportional to current income (10s worth)
    const incomePerSec = useHallStore
      .getState()
      .getTotalRevenuePerSecond(HALL_CONFIG_LOOKUPS);
    const bonus = incomePerSec.gt(0) ? incomePerSec.mul(10) : D(10);
    addSpiritStones(bonus);
  }, [addSpiritStones]);

  const renderContent = () => {
    switch (activeTab) {
      case 'sect': return <SectMountain />;
      case 'elders': return <ElderPanel />;
      case 'alchemy': return <AlchemyPanel />;
      case 'daoPath': return <DaoPathSelector />;
      case 'challenges': return <ChallengePanel />;
      case 'mandate': return <MandatePanel />;
      case 'hdpShop': return <HdpShopPanel />;
      case 'disciples': return <DisciplePanel />;
      case 'dungeons': return <DungeonPanel />;
      case 'legacy': return <LegacyShrinePanel />;
      case 'settings': return <SettingsPanel />;
      default: return <SectMountain />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#0d1b2a] to-[#1a0a2e] text-[#e8dcc8]">
      {/* Offline return overlay */}
      {offlineReturn && (
        <OfflineReturnScreen
          offlineSeconds={offlineReturn.seconds}
          spiritStonesEarned={offlineReturn.spiritStones}
          onCollect={handleOfflineCollect}
        />
      )}

      {/* Top currency bar */}
      <CurrencyBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar navigation */}
        <nav className="w-44 shrink-0 flex flex-col bg-[rgba(13,27,42,0.9)] border-r border-[rgba(45,90,61,0.3)] overflow-y-auto">
          <div className="p-3 border-b border-[rgba(45,90,61,0.2)]">
            <h1 className="text-sm font-bold text-[#c9a84c] tracking-wider">IMMORTAL SECT</h1>
            <p className="text-[10px] text-[#a89660]">Cultivation Tycoon</p>
          </div>

          <div className="flex-1 py-2 space-y-0.5">
            {visibleTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const isNewlyUnlocked = tab.id === 'elders' && highestHallLevel >= 5 && highestHallLevel < 10;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full px-3 py-2 text-left text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-[rgba(45,90,61,0.2)] text-[#c9a84c] border-r-2 border-[#c9a84c]'
                      : 'text-[#a89660] hover:text-[#e8dcc8] hover:bg-[rgba(45,90,61,0.1)]'
                    }
                    ${isNewlyUnlocked ? 'animate-pulse-cyan' : ''}
                  `}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Ascension button at bottom of sidebar */}
          {ascensionCount > 0 || highestHallLevel >= 25 ? (
            <div className="p-2 border-t border-[rgba(45,90,61,0.2)]">
              <button
                onClick={() => setShowAscension(true)}
                className="w-full py-2 rounded-lg bg-[rgba(201,168,76,0.1)] border border-[#c9a84c] text-[#c9a84c] text-xs font-bold hover:bg-[rgba(201,168,76,0.2)] transition-all"
              >
                Ascend
              </button>
            </div>
          ) : null}
        </nav>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Floating Heavenly Treasure overlay */}
      <HeavenlyTreasure onCollect={handleTreasureCollect} />

      {/* Ascension screen overlay */}
      {showAscension && (
        <AscensionScreen onClose={() => setShowAscension(false)} />
      )}
    </div>
  );
}
