import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  save,
  load,
  exportSave,
  importSave,
  deleteSave,
  type SaveGameState,
} from '@core/SaveSystem';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

function createTestState(overrides: Partial<SaveGameState> = {}): SaveGameState {
  return {
    version: 1,
    timestamp: Date.now(),
    totalPlayTime: 3600,
    ascensionCount: 2,
    currentRealm: 'mortal',
    activeDaoPath: null,
    spiritStones: '12345.67',
    hdp: 50,
    daoCrystals: 10,
    heavenlySeals: 5,
    alchemyEssence: '100',
    recruitmentTokens: 20,
    qiResidue: 15,
    legacyPower: 3,
    halls: {
      1: {
        level: 100,
        cycleProgress: 0.5,
        isAutomated: true,
        isUnlocked: true,
        speedMultiplier: '8',
        profitMultiplier: '1',
      },
    },
    elders: { 1: { hired: true } },
    totalHDP: 50,
    spentHDP: 10,
    hdpShopPurchases: { 'auto-1': 1 },
    bestHDP: 25,
    fastestAscension: 7200,
    settings: {
      soundEnabled: true,
      notationsStyle: 'standard',
    },
    ...overrides,
  };
}

describe('SaveSystem', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('save + load roundtrip', () => {
    it('should save and load state with identical values', () => {
      const state = createTestState();
      save(state);

      const loaded = load();
      expect(loaded).not.toBeNull();
      expect(loaded!.spiritStones).toBe(state.spiritStones);
      expect(loaded!.hdp).toBe(state.hdp);
      expect(loaded!.daoCrystals).toBe(state.daoCrystals);
      expect(loaded!.ascensionCount).toBe(state.ascensionCount);
      expect(loaded!.halls[1].level).toBe(100);
      expect(loaded!.halls[1].isAutomated).toBe(true);
      expect(loaded!.elders[1].hired).toBe(true);
      expect(loaded!.totalHDP).toBe(50);
      expect(loaded!.spentHDP).toBe(10);
    });

    it('should set version and timestamp on save', () => {
      const state = createTestState({ version: 0, timestamp: 0 });
      save(state);

      const loaded = load();
      expect(loaded).not.toBeNull();
      expect(loaded!.version).toBe(1);
      expect(loaded!.timestamp).toBeGreaterThan(0);
    });
  });

  describe('exportSave', () => {
    it('should return a base64 string when save exists', () => {
      const state = createTestState();
      save(state);

      const exported = exportSave();
      expect(typeof exported).toBe('string');
      expect(exported.length).toBeGreaterThan(0);
      // Base64 characters only
      expect(exported).toMatch(/^[A-Za-z0-9+/=]+$/);
    });

    it('should return empty string when no save exists', () => {
      const exported = exportSave();
      expect(exported).toBe('');
    });
  });

  describe('importSave', () => {
    it('should import valid base64 save data', () => {
      // First save a state to get valid base64
      const state = createTestState();
      save(state);
      const exported = exportSave();

      // Clear localStorage and import
      localStorageMock.clear();
      const imported = importSave(exported);

      expect(imported).not.toBeNull();
      expect(imported.spiritStones).toBe(state.spiritStones);
      expect(imported.hdp).toBe(state.hdp);
    });

    it('should throw on corrupted/invalid base64 data', () => {
      expect(() => importSave('not-valid-base64!!!')).toThrow();
    });

    it('should throw on valid base64 but invalid JSON structure', () => {
      const badData = btoa('{"notAValidSave": true}');
      expect(() => importSave(badData)).toThrow();
    });

    it('should throw on empty string', () => {
      expect(() => importSave('')).toThrow();
    });
  });

  describe('deleteSave', () => {
    it('should remove save from localStorage', () => {
      save(createTestState());
      expect(load()).not.toBeNull();

      deleteSave();
      expect(load()).toBeNull();
    });
  });

  describe('load edge cases', () => {
    it('should return null when no save exists', () => {
      expect(load()).toBeNull();
    });

    it('should return null for corrupted localStorage data', () => {
      localStorageMock.setItem('cultivation-sect-tycoon-save', 'corrupted!!!');
      expect(load()).toBeNull();
    });
  });
});
