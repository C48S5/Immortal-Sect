import Decimal from 'break_infinity.js';
import { Currencies } from './currency';
import { HallState } from './hall';
import { ElderState } from './elder';
import { Disciple } from './disciple';
import { DaoPathState } from './daoPath';
import { ChallengeState } from './challenge';
import { AlchemyState } from './alchemy';
import { SecretRealmState } from './secretRealm';
import { LegacyShrine } from './legacy';
import { QiResidueBuff } from './legacy';
import { MandateState } from './mandate';

/** HDP shop upgrade state */
export interface HdpUpgradeState {
  /** Upgrade ID */
  upgradeId: number;
  /** Whether purchased */
  purchased: boolean;
}

/** Automation unlock state */
export interface AutomationState {
  /** HDP threshold for this unlock */
  hdpThreshold: number;
  /** Whether this automation is active */
  active: boolean;
}

/** Sect Harmony milestone state (all-hall thresholds) */
export interface SectHarmonyState {
  /** Minimum level across all 12 halls */
  minimumAllHallLevel: number;
  /** Active speed multiplier from sect harmony milestones */
  speedMult: number;
  /** Active profit multiplier from sect harmony milestones */
  profitMult: number;
}

/** Offline earnings calculation result */
export interface OfflineReturn {
  /** Duration offline in seconds */
  offlineSeconds: number;
  /** Spirit Stones earned while offline */
  spiritStonesEarned: Decimal;
  /** AE earned while offline */
  aeEarned: Decimal;
  /** Idle farming rewards collected from Secret Realms */
  idleFarmingRewards: {
    spiritStones: Decimal;
    recruitmentTokens: number;
    alchemyEssence: number;
  };
  /** Offline efficiency multiplier applied */
  efficiencyMultiplier: number;
}

/** Serializable save data */
export interface SaveData {
  /** Save format version for migration */
  version: number;
  /** Timestamp of the save */
  timestamp: number;
  /** All currency balances */
  currencies: {
    spiritStones: string;
    hdp: number;
    daoCrystals: number;
    heavenlySeals: number;
    alchemyEssence: string;
    recruitmentTokens: number;
    qiResidue: number;
  };
  /** Hall states */
  halls: HallState[];
  /** Elder hire states */
  elders: ElderState[];
  /** Owned disciple instances */
  disciples: Disciple[];
  /** Dao path selection */
  daoPath: DaoPathState;
  /** Challenge completion states */
  challenges: ChallengeState[];
  /** Alchemy system state */
  alchemy: AlchemyState;
  /** Secret realm states */
  secretRealms: SecretRealmState[];
  /** Legacy shrine data */
  legacyShrine: LegacyShrine;
  /** Qi Residue shop purchases */
  qiResidueBuffs: QiResidueBuff[];
  /** Mandate slot levels */
  mandate: MandateState;
  /** HDP shop purchases */
  hdpUpgrades: HdpUpgradeState[];
  /** Automation unlock states */
  automationUnlocks: AutomationState[];
  /** Sect harmony data */
  sectHarmony: SectHarmonyState;
  /** Total era revenue for HDP calculation */
  totalEraRevenue: string;
  /** Previous session revenue for HDP calculation */
  prevSessionRevenue: string;
  /** Total ascension count */
  ascensionCount: number;
  /** Total gacha pulls (for spark system) */
  totalGachaPulls: number;
  /** Current pity counter (resets on Epic+ pull) */
  currentPityCounter: number;
}

/** Full runtime game state (in-memory) */
export interface GameState {
  /** All currency balances */
  currencies: Currencies;
  /** Hall states for all 12 halls */
  halls: HallState[];
  /** Elder states */
  elders: ElderState[];
  /** Owned disciple instances */
  disciples: Disciple[];
  /** Dao path state */
  daoPath: DaoPathState;
  /** Challenge states */
  challenges: ChallengeState[];
  /** Alchemy system state */
  alchemy: AlchemyState;
  /** Secret realm states */
  secretRealms: SecretRealmState[];
  /** Legacy shrine */
  legacyShrine: LegacyShrine;
  /** Qi Residue shop buffs */
  qiResidueBuffs: QiResidueBuff[];
  /** Mandate state */
  mandate: MandateState;
  /** HDP shop upgrades */
  hdpUpgrades: HdpUpgradeState[];
  /** Automation unlocks */
  automationUnlocks: AutomationState[];
  /** Sect harmony */
  sectHarmony: SectHarmonyState;
  /** Total revenue this era (for HDP calculation) */
  totalEraRevenue: Decimal;
  /** Previous session revenue (for HDP calculation) */
  prevSessionRevenue: Decimal;
  /** Ascension count */
  ascensionCount: number;
  /** Total gacha pulls */
  totalGachaPulls: number;
  /** Current pity counter */
  currentPityCounter: number;
  /** Last update timestamp (for delta time calculation) */
  lastUpdateTimestamp: number;
}
