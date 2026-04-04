import Decimal from 'break_infinity.js';

const SAVE_KEY = 'cultivation-sect-tycoon-save';
const CURRENT_VERSION = 1;
const AUTO_SAVE_INTERVAL_MS = 30_000; // 30 seconds

/**
 * Serializable game state for save/load.
 * TODO: Replace with full GameState from models once available.
 */
export interface SaveGameState {
  version: number;
  timestamp: number;
  totalPlayTime: number;
  ascensionCount: number;
  currentRealm: 'mortal' | 'immortal' | 'celestial';
  activeDaoPath: string | null;

  // Currencies (Decimal stored as string for serialization)
  spiritStones: string;
  hdp: number;
  daoCrystals: number;
  heavenlySeals: number;
  alchemyEssence: string;
  recruitmentTokens: number;
  qiResidue: number;
  legacyPower: number;

  // Hall states
  halls: Record<number, {
    level: number;
    cycleProgress: number;
    isAutomated: boolean;
    isUnlocked: boolean;
    speedMultiplier: string;
    profitMultiplier: string;
  }>;

  // Elder states
  elders: Record<number, { hired: boolean }>;

  // Prestige
  totalHDP: number;
  spentHDP: number;
  hdpShopPurchases: Record<string, number>;
  bestHDP: number;
  fastestAscension: number;
  totalRevenueThisRun?: string;

  // Settings
  settings: {
    soundEnabled: boolean;
    notationsStyle: string;
  };

  // --- Optional fields for new systems (backwards-compatible) ---
  mandateSlots?: Record<number, number>;
  disciples?: { roster: any[]; totalPulls: number; pullsSincePity: number };
  challenges?: Record<number, { completed: boolean; active: boolean; currentEarnings: string }>;
  dungeonRealms?: Record<string, any>;
  legacy?: { fragments: any[]; techniques: any[]; qrShopPurchases: Record<string, number> };
  alchemyBuffs?: Array<{ itemId: number; remainingSeconds: number; multiplier: number; affectedHallIds: number[] }>;
  daoPathSpell?: { spellActive: boolean; spellRemainingDuration: number; spellCooldownRemaining: number };
}

/** Version migration functions. Key = version to migrate FROM. */
const migrations: Record<number, (save: SaveGameState) => SaveGameState> = {
  // Example: migrate from v1 to v2
  // 1: (save) => { save.version = 2; save.newField = 'default'; return save; },
};

/** Encode a string to base64 (browser-safe) */
function toBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

/** Decode base64 to string (browser-safe) */
function fromBase64(b64: string): string {
  return decodeURIComponent(escape(atob(b64)));
}

/** Run all necessary migrations on a save object */
function migrate(save: SaveGameState): SaveGameState {
  let current = save;
  while (current.version < CURRENT_VERSION) {
    const migrator = migrations[current.version];
    if (!migrator) {
      console.warn(
        `No migration found for save version ${current.version}. Resetting.`,
      );
      return current;
    }
    current = migrator(current);
  }
  return current;
}

/**
 * Save game state to localStorage.
 * Decimal values are serialized as strings.
 */
export function save(state: SaveGameState): void {
  try {
    state.version = CURRENT_VERSION;
    state.timestamp = Date.now();
    const json = JSON.stringify(state);
    const encoded = toBase64(json);
    localStorage.setItem(SAVE_KEY, encoded);
  } catch (err) {
    console.error('Failed to save game:', err);
  }
}

/**
 * Load game state from localStorage.
 * Returns null if no save exists or if data is corrupted.
 */
export function load(): SaveGameState | null {
  try {
    const encoded = localStorage.getItem(SAVE_KEY);
    if (!encoded) return null;

    const json = fromBase64(encoded);
    const parsed = JSON.parse(json) as SaveGameState;

    if (!parsed.version || typeof parsed.version !== 'number') {
      console.warn('Invalid save data: no version field');
      return null;
    }

    // Run migrations if needed
    const migrated = migrate(parsed);
    return migrated;
  } catch (err) {
    console.error('Failed to load save:', err);
    return null;
  }
}

/** Export save as a base64 string for clipboard sharing. */
export function exportSave(): string {
  const encoded = localStorage.getItem(SAVE_KEY);
  return encoded ?? '';
}

/**
 * Import a save from a base64 string.
 * Validates structure before applying.
 */
export function importSave(data: string): SaveGameState {
  try {
    const json = fromBase64(data);
    const parsed = JSON.parse(json) as SaveGameState;

    if (!parsed.version || typeof parsed.spiritStones !== 'string') {
      throw new Error('Invalid save data structure');
    }

    const migrated = migrate(parsed);
    // Persist the imported save
    save(migrated);
    return migrated;
  } catch (err) {
    throw new Error(`Failed to import save: ${err instanceof Error ? err.message : 'unknown error'}`);
  }
}

/** Delete the save from localStorage. */
export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

// --- Auto-save timer ---

let autoSaveTimerId: ReturnType<typeof setInterval> | null = null;

/**
 * Start the auto-save timer.
 * @param getState - Function that returns the current game state to save
 */
export function startAutoSave(getState: () => SaveGameState): void {
  stopAutoSave();
  autoSaveTimerId = setInterval(() => {
    save(getState());
  }, AUTO_SAVE_INTERVAL_MS);
}

/** Stop the auto-save timer. */
export function stopAutoSave(): void {
  if (autoSaveTimerId !== null) {
    clearInterval(autoSaveTimerId);
    autoSaveTimerId = null;
  }
}

/**
 * Helper to convert store Decimals to save-friendly strings.
 * Used when building a SaveGameState from Zustand stores.
 */
export function decimalToString(d: Decimal): string {
  return d.toString();
}

/**
 * Helper to restore Decimals from save strings.
 */
export function stringToDecimal(s: string): Decimal {
  return new Decimal(s);
}
