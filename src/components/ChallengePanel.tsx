import { useEffect } from 'react';
import { formatNumber, D } from '@core/BigNumber';
import { CHALLENGE_CONFIGS } from '@data/challengeConfigs';
import { useChallengeStore } from '@state/challengeStore';

export function ChallengePanel() {
  const challenges = useChallengeStore((s) => s.challenges);
  const initChallenges = useChallengeStore((s) => s.initChallenges);
  const enterChallenge = useChallengeStore((s) => s.enterChallenge);
  const exitChallenge = useChallengeStore((s) => s.exitChallenge);
  const getActiveChallenge = useChallengeStore((s) => s.getActiveChallenge);

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

  const activeChallengeId = getActiveChallenge();
  const activeChallenge = activeChallengeId !== null
    ? { id: activeChallengeId, ...challenges[activeChallengeId] }
    : null;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-[#c9a84c] mb-2">Tribulation Challenges</h2>
      <p className="text-sm text-[#a89660] mb-4">
        Complete challenges under restrictions to earn permanent bonuses.
        Only one challenge can be active at a time.
      </p>

      {activeChallenge && (() => {
        const config = CHALLENGE_CONFIGS.find((c) => c.id === activeChallenge.id);
        if (!config) return null;
        const earnings = D(activeChallenge.currentEarnings);
        return (
          <div className="mb-4 p-3 rounded-lg bg-[rgba(139,37,0,0.1)] border border-[#8b2500] animate-pulse-red">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-[#8b2500] font-bold uppercase">Active Challenge</span>
                <h3 className="text-sm font-bold text-[#e8dcc8]">
                  {config.name}
                </h3>
              </div>
              <button
                onClick={handleExit}
                className="px-3 py-1 rounded text-xs font-bold bg-[rgba(139,37,0,0.2)] border border-[#8b2500] text-[#8b2500] hover:bg-[rgba(139,37,0,0.4)] transition-all"
              >
                Exit Challenge
              </button>
            </div>
            <div className="mt-2 w-full h-2 rounded-full bg-[rgba(13,27,42,0.6)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#8b2500] transition-all duration-300"
                style={{
                  width: `${Math.min(
                    earnings.div(config.targetEarnings).toNumber() * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <div className="text-xs text-[#a89660] mt-1">
              {formatNumber(earnings)} / {formatNumber(config.targetEarnings)} SS
            </div>
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
                ${state.completed ? 'border-[#c9a84c]' : isActive ? 'border-[#8b2500] animate-pulse-red' : 'border-[rgba(45,90,61,0.3)]'}
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-[#e8dcc8]">{config.name}</h3>
                {state.completed && <span className="text-lg">&#127942;</span>}
              </div>
              <p className="text-xs text-[#8b2500] mb-1">{config.restriction}</p>
              <p className="text-xs text-[#a89660] mb-1">Target: {formatNumber(config.targetEarnings)} SS</p>
              <p className="text-xs text-[#4caf50] mb-2">Reward: {config.rewardDescription}</p>

              {!state.completed && !isActive && !activeChallenge && (
                <button
                  onClick={() => handleEnter(config.id)}
                  className="w-full py-1.5 rounded text-xs font-bold bg-[rgba(139,37,0,0.15)] border border-[#8b2500] text-[#8b2500] hover:bg-[rgba(139,37,0,0.3)] transition-all"
                >
                  Enter Challenge
                </button>
              )}
              {state.completed && (
                <div className="text-xs text-[#c9a84c] font-bold text-center py-1.5">
                  Completed
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
