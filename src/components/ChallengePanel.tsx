import { useEffect } from 'react';
import { formatNumber, D } from '@core/BigNumber';
import { CHALLENGE_CONFIGS } from '@data/challengeConfigs';
import { useChallengeStore } from '@state/challengeStore';
import { useHallStore } from '@state/hallStore';
import { useElderStore } from '@state/elderStore';
import { useGameStore } from '@state/gameStore';

export function ChallengePanel() {
  const challenges = useChallengeStore((s) => s.challenges);
  const initChallenges = useChallengeStore((s) => s.initChallenges);
  const enterChallenge = useChallengeStore((s) => s.enterChallenge);
  const exitChallenge = useChallengeStore((s) => s.exitChallenge);
  const getActiveChallenge = useChallengeStore((s) => s.getActiveChallenge);
  const activeChallengeId = getActiveChallenge();
  const halls = useHallStore((s) => s.halls);
  const elders = useElderStore((s) => s.elders);
  const activeDaoPath = useGameStore((s) => s.activeDaoPath);

  useEffect(() => {
    if (Object.keys(challenges).length === 0) {
      initChallenges();
    }
  }, [challenges, initChallenges]);

  const handleEnter = (id: number) => {
    enterChallenge(id);
  };

  const handleExit = () => {
    exitChallenge();
  };

  const activeChallenge = activeChallengeId !== null
    ? { id: activeChallengeId, ...challenges[activeChallengeId] }
    : null;

  const statusDetails = (() => {
    if (activeChallengeId === null) return null;
    const hallIds = Object.keys(halls).map(Number);
    const enabledHallCount = hallIds.filter((id) => halls[id]?.isUnlocked).length;
    const hiredElders = Object.values(elders).filter((e) => e.hired).length;

    switch (activeChallengeId) {
      case 1:
        return `Enforced: only Hall 1 can generate income. Currently enabled halls: ${enabledHallCount}`;
      case 2:
        return `Enforced: elder hiring blocked. Elders currently hired: ${hiredElders}`;
      case 4:
        return 'Enforced: alchemy crafting is disabled during this tribulation.';
      case 7:
        return 'Enforced: only Halls 1 and 7 can generate income.';
      case 9:
        return 'Enforced: no active in-session income gain; progression from offline return only.';
      case 12:
        return `Enforced: combined restrictions active. Dao Path selected: ${activeDaoPath ?? 'none'}`;
      default:
        return 'Restriction modifiers are actively enforced by the simulation loop.';
    }
  })();

  return (
    <div className="p-5">
      <h2 className="section-header mb-2">Heavenly Tribulations</h2>
      <p className="text-sm text-gold-muted mb-4">
        Endure tribulations under harsh restrictions. Survive to claim permanent blessings.
        Only one tribulation may be faced at a time.
      </p>

      {activeChallenge && (() => {
        const config = CHALLENGE_CONFIGS.find((c) => c.id === activeChallenge.id);
        if (!config) return null;
        const earnings = D(activeChallenge.currentEarnings);
        return (
          <div className="mb-4 p-3 rounded-lg bg-[rgba(139,37,0,0.1)] border border-crimson animate-pulse-red">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-crimson font-bold uppercase">Active Tribulation</span>
                <h3 className="text-sm font-bold text-warm-white">
                  {config.name}
                </h3>
              </div>
              <button
                onClick={handleExit}
                className="px-3 py-1 rounded text-xs font-bold bg-[rgba(139,37,0,0.2)] border border-crimson text-crimson hover:bg-[rgba(139,37,0,0.4)] transition-all"
              >
                Abandon Tribulation
              </button>
            </div>
            <div className="mt-2 w-full h-2 rounded-full bg-[rgba(13,27,42,0.6)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#d94a2b] transition-all duration-300"
                style={{
                  width: `${Math.min(
                    earnings.div(config.targetEarnings).toNumber() * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <div className="text-xs text-gold-muted mt-1">
              {formatNumber(earnings)} / {formatNumber(config.targetEarnings)} Spirit Stones earned
            </div>
            {statusDetails && (
              <div className="text-[11px] text-warm-white mt-2 p-2 rounded bg-[rgba(13,27,42,0.4)] border border-[rgba(45,90,61,0.25)]">
                {statusDetails}
              </div>
            )}
          </div>
        );
      })()}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CHALLENGE_CONFIGS.map((config) => {
          const state = challenges[config.id];
          if (!state) return null;
          const isActive = state.active;

          return (
            <div
              key={config.id}
              className={`
                p-3 rounded-lg border transition-all duration-200
                bg-[rgba(13,27,42,0.85)]
                ${state.completed ? 'border-gold' : isActive ? 'border-crimson animate-pulse-red' : 'border-[rgba(45,90,61,0.3)]'}
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-warm-white">{config.name}</h3>
                {state.completed && <span className="text-lg">&#127942;</span>}
              </div>
              <p className="text-xs text-crimson mb-1">{config.restriction}</p>
              <p className="text-xs text-gold-muted mb-1">Target: {formatNumber(config.targetEarnings)} SS</p>
              <p className="text-xs text-success mb-2">Reward: {config.rewardDescription}</p>

              {!state.completed && !isActive && !activeChallenge && (
                <button
                  onClick={() => handleEnter(config.id)}
                  className="w-full py-1.5 rounded text-xs font-bold bg-[rgba(139,37,0,0.15)] border border-crimson text-crimson hover:bg-[rgba(139,37,0,0.3)] transition-all"
                >
                  Begin Tribulation
                </button>
              )}
              {state.completed && (
                <div className="text-xs text-gold font-bold text-center py-1.5">
                  Tribulation Overcome
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
