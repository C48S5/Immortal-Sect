import { useEffect } from 'react';
import { useMissionStore } from '@state/missionStore';
import { MISSION_POOL, DAILY_CHECK_IN_RT } from '@data/missionConfigs';

export function MissionPanel() {
  const missions = useMissionStore((s) => s.missions);
  const dailyCheckInClaimed = useMissionStore((s) => s.dailyCheckInClaimed);
  const refreshIfNeeded = useMissionStore((s) => s.refreshIfNeeded);
  const claimMission = useMissionStore((s) => s.claimMission);
  const claimDailyCheckIn = useMissionStore((s) => s.claimDailyCheckIn);

  // Refresh missions on mount
  useEffect(() => {
    refreshIfNeeded();
  }, [refreshIfNeeded]);

  const allClaimed = missions.every((m) => m.claimed);

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-header">Sect Missions</h2>
        <div className="text-xs text-gold-muted">Resets daily at midnight</div>
      </div>

      {/* Daily Check-In */}
      <div className={`
        flex items-center justify-between p-3 mb-4 rounded-lg border transition-all duration-200
        bg-[rgba(13,27,42,0.85)]
        ${dailyCheckInClaimed ? 'border-success opacity-70' : 'border-[rgba(201,168,76,0.4)]'}
      `}>
        <div>
          <h3 className="text-sm font-bold text-warm-white">Daily Check-In</h3>
          <p className="text-xs text-gold-muted">Claim your daily reward for visiting</p>
        </div>
        {dailyCheckInClaimed ? (
          <span className="text-xs text-success font-bold px-3">Claimed</span>
        ) : (
          <button
            onClick={claimDailyCheckIn}
            className="ml-3 px-4 py-2 rounded text-xs font-bold transition-all duration-150
              bg-[rgba(201,168,76,0.15)] border border-gold text-gold hover:bg-[rgba(201,168,76,0.3)]"
          >
            +{DAILY_CHECK_IN_RT} RT
          </button>
        )}
      </div>

      {/* Mission List */}
      <div className="space-y-2">
        {missions.map((mission) => {
          const config = MISSION_POOL.find((c) => c.id === mission.configId);
          if (!config) return null;

          const progress = Math.min(mission.progress, config.target);
          const pct = (progress / config.target) * 100;

          return (
            <div
              key={mission.configId}
              className={`
                p-3 rounded-lg border transition-all duration-200
                bg-[rgba(13,27,42,0.85)]
                ${mission.claimed ? 'border-success opacity-60' : ''}
                ${mission.completed && !mission.claimed ? 'border-[rgba(201,168,76,0.5)]' : ''}
                ${!mission.completed ? 'border-[rgba(45,90,61,0.3)]' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-warm-white">{config.name}</h3>
                    {mission.claimed && <span className="text-success">&#10004;</span>}
                  </div>
                  <p className="text-xs text-gold-muted">{config.description}</p>
                </div>

                <div className="ml-3 text-right">
                  {mission.claimed ? (
                    <span className="text-xs text-success font-bold">Done</span>
                  ) : mission.completed ? (
                    <button
                      onClick={() => claimMission(mission.configId)}
                      className="px-3 py-1.5 rounded text-xs font-bold transition-all duration-150
                        bg-[rgba(201,168,76,0.15)] border border-gold text-gold hover:bg-[rgba(201,168,76,0.3)]"
                    >
                      Claim
                    </button>
                  ) : (
                    <span className="text-xs text-gold-muted font-mono">{progress}/{config.target}</span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              {!mission.claimed && (
                <div className="w-full h-1 rounded-full bg-[rgba(10,15,26,0.6)] mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      mission.completed
                        ? 'bg-gold'
                        : 'bg-gradient-to-r from-[#a89660] to-[#c9a84c]'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}

              {/* Rewards */}
              <div className="flex gap-3 mt-1.5">
                {config.rtReward > 0 && (
                  <span className="text-[10px] text-success">+{config.rtReward} RT</span>
                )}
                {config.aeReward > 0 && (
                  <span className="text-[10px] text-gold">+{config.aeReward} AE</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {missions.length === 0 && (
        <div className="text-center text-sm text-gold-muted py-8">
          Loading daily missions...
        </div>
      )}

      {allClaimed && missions.length > 0 && (
        <div className="mt-4 text-center text-xs text-success">
          All missions complete! Come back tomorrow.
        </div>
      )}
    </div>
  );
}
