import { useGameStore } from '@state/gameStore';
import { useDaoPathStore } from '@state/daoPathStore';
import { DAO_PATH_CONFIGS } from '@data/daoPathConfigs';

const PATH_STYLES: Record<number, { color: string; accent: string; desc: string }> = {
  1: { color: '#8b2500', accent: 'rgba(139,37,0,0.3)', desc: 'The way of the blade cuts through all obstacles' },
  2: { color: '#c9a84c', accent: 'rgba(201,168,76,0.3)', desc: 'Master the furnace, master the world' },
  3: { color: '#1a7a6d', accent: 'rgba(26,122,109,0.3)', desc: 'In patterns lies the truth of heaven and earth' },
  4: { color: '#808080', accent: 'rgba(128,128,128,0.3)', desc: 'The body is the first and last weapon' },
  5: { color: '#1a4a7a', accent: 'rgba(26,74,122,0.3)', desc: 'See beyond the veil of mortal perception' },
};

export function DaoPathSelector() {
  const activeDaoPath = useGameStore((s) => s.activeDaoPath);
  const setActiveDaoPath = useGameStore((s) => s.setActiveDaoPath);

  const spellActive = useDaoPathStore((s) => s.spellActive);
  const spellRemainingDuration = useDaoPathStore((s) => s.spellRemainingDuration);
  const spellCooldownRemaining = useDaoPathStore((s) => s.spellCooldownRemaining);
  const activateSpell = useDaoPathStore((s) => s.activateSpell);
  const resetSpell = useDaoPathStore((s) => s.resetSpell);

  const selectedPathId = activeDaoPath ? parseInt(activeDaoPath, 10) : null;

  const handleSelectPath = (pathId: number) => {
    resetSpell();
    setActiveDaoPath(String(pathId));
  };

  const handleActivateSpell = () => {
    if (!selectedPathId) return;
    if (spellActive || spellCooldownRemaining > 0) return;
    activateSpell();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-[#c9a84c] mb-2">Dao Path Selection</h2>
      <p className="text-sm text-[#a89660] mb-4">
        Choose your cultivation path. Each path boosts specific halls and grants a powerful spell.
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        {DAO_PATH_CONFIGS.map((path) => {
          const style = PATH_STYLES[path.id];
          const isSelected = selectedPathId === path.id;

          return (
            <button
              key={path.id}
              onClick={() => handleSelectPath(path.id)}
              className={`
                flex-1 min-w-[160px] p-4 rounded-lg border-2 transition-all duration-300 text-left
                bg-[rgba(13,27,42,0.85)]
                ${isSelected
                  ? `border-[${style.color}] shadow-[0_0_20px_${style.accent}]`
                  : 'border-[rgba(45,90,61,0.3)] hover:border-[rgba(45,90,61,0.6)]'
                }
              `}
              style={isSelected ? { borderColor: style.color, boxShadow: `0 0 20px ${style.accent}` } : {}}
            >
              <h3 className="font-bold text-sm mb-1" style={{ color: style.color }}>
                {path.name}
              </h3>
              <p className="text-xs text-[#a89660] italic mb-2">{style.desc}</p>
              <p className="text-xs text-[#e8dcc8] mb-1">
                Boosts Halls: {path.boostedHallIds.join(', ')} (x{path.hallMultiplier})
              </p>
              <p className="text-xs text-[#a89660]">{path.passiveDescription}</p>
              <div className="mt-2 pt-2 border-t border-[rgba(45,90,61,0.2)]">
                <p className="text-xs font-bold" style={{ color: style.color }}>
                  {path.spell.name}
                </p>
                <p className="text-[10px] text-[#a89660]">{path.spell.effectDescription}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active spell controls */}
      {selectedPathId && (
        <div className="p-4 rounded-lg bg-[rgba(13,27,42,0.85)] border border-[rgba(45,90,61,0.3)]">
          <h3 className="text-sm font-bold text-[#e8dcc8] mb-2">Active Spell</h3>
          {(() => {
            const path = DAO_PATH_CONFIGS[selectedPathId - 1];
            const style = PATH_STYLES[selectedPathId];
            const canCast = !spellActive && spellCooldownRemaining <= 0;

            return (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleActivateSpell}
                  disabled={!canCast}
                  className={`
                    px-6 py-2 rounded-lg font-bold text-sm transition-all duration-200
                    ${canCast
                      ? 'text-[#e8dcc8] hover:brightness-110 cursor-pointer'
                      : 'bg-[rgba(13,27,42,0.4)] text-[#a89660]/40 cursor-not-allowed'
                    }
                  `}
                  style={canCast ? { backgroundColor: style.accent, borderColor: style.color, border: '1px solid' } : {}}
                >
                  {path.spell.name}
                </button>
                <div className="text-xs text-[#a89660]">
                  {spellActive && (
                    <span className="text-[#4caf50]">Active: {Math.ceil(spellRemainingDuration)}s</span>
                  )}
                  {!spellActive && spellCooldownRemaining > 0 && (
                    <span className="text-[#8b2500]">Cooldown: {Math.ceil(spellCooldownRemaining)}s</span>
                  )}
                  {canCast && <span className="text-[#c9a84c]">Ready</span>}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
