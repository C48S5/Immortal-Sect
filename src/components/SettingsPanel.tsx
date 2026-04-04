import { useState } from 'react';
import { useGameStore } from '@state/gameStore';
import { save as saveToDisk, exportSave, importSave, deleteSave } from '@core/SaveSystem';
import type { SaveGameState } from '@core/SaveSystem';
import { useHallStore } from '@state/hallStore';
import { useElderStore } from '@state/elderStore';
import { usePrestigeStore } from '@state/prestigeStore';

/** Build save state snapshot (mirrors App.tsx buildSaveState) */
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
    totalHDP: ps.totalHDP,
    spentHDP: ps.spentHDP,
    hdpShopPurchases: ps.hdpShopPurchases,
    bestHDP: ps.ascensionHistory.bestHDP,
    fastestAscension: ps.ascensionHistory.fastestAscension,
    settings: gs.settings,
  };
}

export function SettingsPanel() {
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const totalPlayTime = useGameStore((s) => s.totalPlayTime);
  const ascensionCount = useGameStore((s) => s.ascensionCount);
  const hdp = useGameStore((s) => s.hdp);
  const reset = useGameStore((s) => s.reset);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [exportData, setExportData] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const formatPlayTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  const showStatusBriefly = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const handleManualSave = () => {
    saveToDisk(buildSaveState());
    showStatusBriefly('Progress sealed.');
  };

  const handleExport = () => {
    // Save current state first so exportSave reads the latest
    saveToDisk(buildSaveState());
    const encoded = exportSave();
    if (!encoded) {
      showStatusBriefly('No cultivation record found.');
      return;
    }
    setExportData(encoded);
    navigator.clipboard.writeText(encoded).then(
      () => showStatusBriefly('Record copied to clipboard.'),
      () => showStatusBriefly('Record exported below.'),
    );
  };

  const handleImport = () => {
    const input = prompt('Paste your exported cultivation record:');
    if (!input) return;
    try {
      importSave(input.trim());
      // Reload to hydrate all stores from the freshly-imported save
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'This cultivation record could not be read.');
    }
  };

  const handleHardReset = () => {
    deleteSave();
    reset();
    setShowResetConfirm(false);
    window.location.reload();
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="section-header mb-4">Settings</h2>

      {/* Save/Load */}
      <div className="space-y-3 mb-6">
        <h3 className="text-sm font-bold text-gold-muted uppercase tracking-wider">Save & Load</h3>

        {saveStatus && (
          <p className="text-xs text-gold font-bold">{saveStatus}</p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleManualSave}
            className="py-2 rounded-lg bg-[rgba(45,90,61,0.15)] border border-[#4a9968] text-jade text-sm font-bold hover:bg-[rgba(45,90,61,0.3)] transition-all"
          >
            Save Game
          </button>
          <button
            onClick={() => { window.location.reload(); }}
            className="py-2 rounded-lg bg-[rgba(45,90,61,0.15)] border border-[#4a9968] text-jade text-sm font-bold hover:bg-[rgba(45,90,61,0.3)] transition-all"
          >
            Load Game
          </button>
          <button
            onClick={handleExport}
            className="py-2 rounded-lg bg-[rgba(26,74,122,0.15)] border border-[#3d7ec4] text-[#3d7ec4] text-sm font-bold hover:bg-[rgba(26,74,122,0.3)] transition-all"
          >
            Export Save
          </button>
          <button
            onClick={handleImport}
            className="py-2 rounded-lg bg-[rgba(26,74,122,0.15)] border border-[#3d7ec4] text-[#3d7ec4] text-sm font-bold hover:bg-[rgba(26,74,122,0.3)] transition-all"
          >
            Import Save
          </button>
        </div>

        {exportData && (
          <div className="mt-2">
            <textarea
              readOnly
              value={exportData}
              className="w-full h-20 p-2 text-xs font-mono bg-[rgba(13,27,42,0.6)] border border-[rgba(45,90,61,0.3)] text-warm-white rounded resize-none"
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            />
            <p className="text-[10px] text-gold-muted">Record copied. You may also select and copy manually.</p>
          </div>
        )}
      </div>

      {/* Sound */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gold-muted uppercase tracking-wider mb-2">Audio</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            className={`
              w-10 h-5 rounded-full transition-all duration-200 relative
              ${settings.soundEnabled ? 'bg-[#4a9968]' : 'bg-[rgba(45,90,61,0.3)]'}
            `}
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          >
            <div
              className={`
                absolute top-0.5 w-4 h-4 rounded-full bg-[#e8dcc8] transition-all duration-200
                ${settings.soundEnabled ? 'left-5' : 'left-0.5'}
              `}
            />
          </div>
          <span className="text-sm text-warm-white">Sound Effects</span>
          <span className="text-xs text-gold-muted">(coming soon)</span>
        </label>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gold-muted uppercase tracking-wider mb-2">Statistics</h3>
        <div className="space-y-1 p-3 rounded-lg bg-[rgba(13,27,42,0.6)] border border-[rgba(45,90,61,0.2)]">
          <div className="flex justify-between text-xs">
            <span className="text-gold-muted">Total Play Time</span>
            <span className="text-warm-white">{formatPlayTime(totalPlayTime)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gold-muted">Ascension Count</span>
            <span className="text-warm-white">{ascensionCount}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gold-muted">Highest Dao Points</span>
            <span className="text-gold">{hdp}</span>
          </div>
        </div>
      </div>

      {/* Hard Reset */}
      <div>
        <h3 className="text-sm font-bold text-crimson uppercase tracking-wider mb-2">Forbidden Art</h3>
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-2 rounded-lg bg-[rgba(139,37,0,0.1)] border border-crimson text-crimson text-sm font-bold hover:bg-[rgba(139,37,0,0.2)] transition-all"
          >
            Destroy Sect
          </button>
        ) : (
          <div className="p-3 rounded-lg bg-[rgba(139,37,0,0.1)] border border-crimson">
            <p className="text-xs text-crimson mb-2 font-bold">
              This destroys all cultivation progress forever. There is no recovery.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-1.5 rounded text-xs font-bold bg-[rgba(13,27,42,0.6)] border border-[rgba(45,90,61,0.3)] text-gold-muted hover:bg-[rgba(13,27,42,0.8)] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleHardReset}
                className="flex-1 py-1.5 rounded text-xs font-bold bg-[rgba(139,37,0,0.3)] border border-crimson text-crimson hover:bg-[rgba(139,37,0,0.5)] transition-all"
              >
                Destroy All Progress
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
