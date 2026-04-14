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
import { AutomationPanel } from '@components/AutomationPanel';
import { MissionPanel } from '@components/MissionPanel';
import { useMissionStore } from '@state/missionStore';
import { OfflineReturnScreen } from '@components/OfflineReturnScreen';
import { getActiveMilestones, getSectHarmonyBonus, getBodyTemperingAllBonus, getAEBonusFromMilestones } from '@systems/MilestoneSystem';
import { calculateAEPerSecond } from '@systems/AlchemySystem';
import { CHALLENGE_CONFIGS } from '@data/challengeConfigs';
import { ALCHEMY_ITEM_CONFIGS } from '@data/alchemyConfigs';
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
  { id: 'challenges', label: 'Tribulations', isVisible: (s) => s.ascensionCount >= 1 },
  { id: 'mandate', label: 'Mandates', isVisible: (s) => s.ascensionCount >= 1 },
  { id: 'hdpShop', label: 'Empyrean', isVisible: (s) => s.ascensionCount >= 1 },
  { id: 'automation', label: 'Automation', isVisible: (s) => s.ascensionCount >= 1 },
  { id: 'missions', label: 'Missions', isVisible: (s) => s.ascensionCount >= 1 },
  { id: 'disciples', label: 'Disciples', isVisible: (s) => s.hasDisciples },
  { id: 'dungeons', label: 'Secret Realms', isVisible: (s) => s.hasDisciples },
  { id: 'legacy', label: 'Legacy', isVisible: (s) => s.hasDisciples },
  { id: 'settings', label: 'Settings', isVisible: () => true },
];

/** Count Void Meditation Sanctum (Hall 9) offline efficiency milestones reached */
function getVoidMeditationTier(hall9Level: number): number {
  // Hall 9 milestones with specialEffect 'offlineEfficiency' at GDD-accurate levels
  const thresholds = [500, 1200, 2500, 3500, 4500, 6000, 8000, 10000, 12000, 15000];
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
    totalRevenueThisRun: ps.totalRevenueThisRun.toString(),
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
    totalRevenueThisRun: data.totalRevenueThisRun ? new Decimal(data.totalRevenueThisRun) : D(0),
    ascensionHistory: {
      count: data.ascensionCount,
      bestHDP: data.bestHDP,
      fastestAscension: data.fastestAscension,
    },
  });
}

/** Sync hall isAutomated flag with elder hired state after loading */
function syncHallAutomation(): void {
  const hs = useHallStore.getState();
  const es = useElderStore.getState();
  for (const config of ELDER_CONFIGS) {
    const elder = es.elders[config.id];
    if (elder?.hired) {
      const hall = hs.halls[config.hallId];
      if (hall && !hall.isAutomated) {
        hs.setAutomated(config.hallId, true);
      }
    }
  }
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
useMissionStore.getState().refreshIfNeeded();

export default function App() {
  const [activeTab, setActiveTab] = useState('sect');
  const [showAscension, setShowAscension] = useState(false);
  const [, setGameReady] = useState(false);
  const [offlineReturn, setOfflineReturn] = useState<{
    seconds: number;
    spiritStones: Decimal;
    efficiency: number;
    breakdown: {
      base: number;
      voidMeditationBonus: number;
      tribulationBonus: number;
      bodyDaoBonus: number;
      totalEfficiency: number;
    };
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
      usePrestigeStore.subscribe(() => {
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
      syncHallAutomation();

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
              efficiency: result.efficiency,
              breakdown: result.multiplierBreakdown,
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

          // Auto-craft pills (10000 HDP = pills 1-3, 15000 HDP = all pills)
          if (hdp >= 10000) {
            const pillMax = hdp >= 15000 ? 10 : 3;
            const alchStore = useAlchemyStore.getState();
            const activeItemIds = new Set(alchStore.activeBuffs.map((b) => b.itemId));
            const hall3Level = hs.halls[3]?.level ?? 0;

            for (let pillId = 1; pillId <= pillMax; pillId++) {
              if (activeItemIds.has(pillId)) continue;
              const pc = ALCHEMY_ITEM_CONFIGS.find((c) => c.id === pillId);
              if (!pc || hall3Level < pc.unlockLevel) continue;
              if (gs.alchemyEssence.gte(pc.aeCost)) {
                gs.addAE(D(-pc.aeCost));
                alchStore.addBuff({
                  itemId: pc.id,
                  remainingSeconds: pc.durationSeconds,
                  multiplier: pc.multiplier,
                  affectedHallIds: pc.affectedHallIds,
                });
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
    useMissionStore.getState().addProgress('collectTreasure', 1);
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
      case 'automation': return <AutomationPanel />;
      case 'missions': return <MissionPanel />;
      case 'disciples': return <DisciplePanel />;
      case 'dungeons': return <DungeonPanel />;
      case 'legacy': return <LegacyShrinePanel />;
      case 'settings': return <SettingsPanel />;
      default: return <SectMountain />;
    }
  };

  return (
    <div className="flex flex-col h-screen text-warm-white relative">
      {/* Ambient qi particles */}
      <div className="qi-particles">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={`qi-${i}`}
            className="qi-particle animate-qi-particle"
            style={{
              left: `${8 + i * 12}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${8 + i * 1.5}s`,
            }}
          />
        ))}
      </div>

      {/* Offline return overlay */}
      {offlineReturn && (
        <OfflineReturnScreen
          offlineSeconds={offlineReturn.seconds}
          spiritStonesEarned={offlineReturn.spiritStones}
          efficiency={offlineReturn.efficiency}
          breakdown={offlineReturn.breakdown}
          onCollect={handleOfflineCollect}
        />
      )}

      {/* Top currency bar */}
      <CurrencyBar />

      <div className="flex flex-1 overflow-hidden relative z-[2]">
        {/* Left sidebar navigation */}
        <nav className="w-48 shrink-0 flex flex-col sect-sidebar overflow-y-auto">
          <div className="p-4 pb-3">
            <h1 className="sect-title text-sm">Immortal Sect</h1>
            <p className="sect-subtitle">Cultivation Tycoon</p>
            <div className="sect-divider mt-3" />
          </div>

          <div className="flex-1 py-1">
            {visibleTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const isNewlyUnlocked = tab.id === 'elders' && highestHallLevel >= 5 && highestHallLevel < 10;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full text-left sect-nav-item
                    ${isActive ? 'active' : 'text-gold-muted'}
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
            <div className="p-3 border-t border-[rgba(45,90,61,0.1)]">
              <button
                onClick={() => setShowAscension(true)}
                className="w-full ascend-btn"
              >
                Ascend
              </button>
            </div>
          ) : null}
        </nav>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto relative">
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
