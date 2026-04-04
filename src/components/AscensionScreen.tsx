import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@state/gameStore';
import { usePrestigeStore } from '@state/prestigeStore';
import { useMissionStore } from '@state/missionStore';
import { formatNumber } from '@core/BigNumber';
import { HALL_CONFIGS } from '@data/hallConfigs';

interface AscensionScreenProps {
  onClose: () => void;
}

const RESETS = [
  'Spirit Stones', 'Hall Levels', 'Elder Hires', 'Alchemy Essence',
  'Active Elixirs', 'Cycle Progress', 'Tribulation Progress (active)',
];

const PERSISTS = [
  'Heavenly Dao Points', 'Dao Crystals', 'Heavenly Seals',
  'Recruitment Tokens', 'Qi Residue', 'Disciples', 'Legacy Fragments',
  'Completed Tribulations', 'Empyrean Upgrades', 'Secret Realm Progress',
];

const hallConfigLookups = HALL_CONFIGS.map((c) => ({
  id: c.id,
  baseCost: c.baseCost,
  coefficient: c.coefficient,
  cycleSeconds: c.cycleSeconds,
  baseRevenue: c.baseRevenue,
}));

export function AscensionScreen({ onClose }: AscensionScreenProps) {
  const hdp = useGameStore((s) => s.hdp);
  const ascensionCount = useGameStore((s) => s.ascensionCount);
  const lastTickTime = useGameStore((s) => s.lastTickTime);

  const [phase, setPhase] = useState<'confirm' | 'cinematic' | 'done'>('confirm');
  const [cinematicProgress, setCinematicProgress] = useState(0);

  // Poll prestige data on a 1s interval to avoid re-render-during-render issues
  const [totalRevenueThisRun, setTotalRevenue] = useState(() => usePrestigeStore.getState().totalRevenueThisRun);
  const [hdpToGain, setHdpToGain] = useState(() => usePrestigeStore.getState().getHDPPreview());
  const ascensionAllowed = hdpToGain > 0;

  useEffect(() => {
    const id = setInterval(() => {
      const ps = usePrestigeStore.getState();
      setTotalRevenue(ps.totalRevenueThisRun);
      setHdpToGain(ps.getHDPPreview());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Capture HDP before ascension resets revenue (otherwise done screen shows 0)
  const capturedHdp = useRef(0);
  const capturedAscNum = useRef(0);

  const cinematicRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const handleAscend = () => {
    if (!ascensionAllowed) return;
    capturedHdp.current = hdpToGain;
    capturedAscNum.current = ascensionCount + 1;
    setPhase('cinematic');
  };

  useEffect(() => {
    if (phase !== 'cinematic') return;
    cinematicRef.current = setInterval(() => {
      setCinematicProgress((p) => {
        if (p >= 100) {
          clearInterval(cinematicRef.current);
          // Calculate run duration from lastTickTime as a proxy for run start
          const runDurationSeconds = Math.floor((Date.now() - lastTickTime) / 1000);
          usePrestigeStore.getState().performAscension(hallConfigLookups, runDurationSeconds);
          useMissionStore.getState().addProgress('ascend', 1);
          setPhase('done');
          return 100;
        }
        return p + 2;
      });
    }, 60);
    return () => clearInterval(cinematicRef.current);
  }, [phase, lastTickTime]);

  // Stars for cinematic
  const stars = useRef(
    Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: 1 + Math.random() * 2,
    }))
  );

  if (phase === 'cinematic') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
        {/* Starfield */}
        {stars.current.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}

        {/* Qi particles */}
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={`qi-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#2ba695] animate-qi-particle"
            style={{
              left: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 0.5}s`,
              opacity: 0.6,
            }}
          />
        ))}

        {/* Sect silhouette */}
        <div className="animate-ascension-glow">
          <svg viewBox="0 0 200 150" className="w-48 h-36 opacity-70">
            <polygon points="100,10 60,60 40,60 30,100 10,100 0,150 200,150 190,100 170,100 160,60 140,60" fill="#4a9968" />
            <polygon points="100,30 75,60 50,80 30,120 20,150 180,150 170,120 150,80 125,60" fill="#1d3a28" />
          </svg>
        </div>

        {/* Progress text */}
        <div className="absolute bottom-20 text-center">
          <p className="text-gold text-lg font-bold">Transcending to the next realm...</p>
          <div className="w-48 h-2 rounded-full bg-[rgba(13,27,42,0.6)] mt-3 mx-auto overflow-hidden">
            <div
              className="h-full rounded-full bg-gold transition-all duration-100"
              style={{ width: `${cinematicProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.95)] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-gold mb-4">Ascension Complete</h2>
          <p className="text-lg text-warm-white mb-2">
            You have gained <span className="text-gold font-bold">{capturedHdp.current} Dao Points</span>
          </p>
          <p className="text-sm text-gold-muted mb-6">
            Total HDP: {hdp} | Ascension #{capturedAscNum.current}
          </p>
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-lg bg-[rgba(201,168,76,0.15)] border-2 border-gold text-gold font-bold hover:bg-[rgba(201,168,76,0.3)] transition-all"
          >
            Begin Anew
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.9)] flex items-center justify-center p-4">
      <div className="max-w-lg w-full p-6 rounded-xl bg-[rgba(13,27,42,0.95)] border-2 border-gold animate-fade-in">
        <h2 className="text-2xl font-bold text-gold text-center mb-4">
          Heavenly Ascension
        </h2>

        <div className="text-center mb-4">
          <p className="text-sm text-gold-muted">Total Revenue This Cultivation Era</p>
          <p className="text-xl font-mono text-warm-white">{formatNumber(totalRevenueThisRun)} SS</p>
        </div>

        <div className="text-center mb-4 p-3 rounded-lg bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)]">
          <p className="text-sm text-gold-muted">Dao Points to be gained</p>
          <p className="text-2xl font-bold text-gold">{hdpToGain} Dao Points</p>
          <p className="text-xs text-gold-muted mt-1">
            Formula: floor(sqrt(totalRevenue / 44.44B))
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <h3 className="text-xs font-bold text-crimson uppercase tracking-wider mb-2">
              Shall be Lost
            </h3>
            <ul className="space-y-1">
              {RESETS.map((item) => (
                <li key={item} className="text-xs text-gold-muted flex items-center gap-1">
                  <span className="text-crimson">&#10005;</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-success uppercase tracking-wider mb-2">
              Shall Endure
            </h3>
            <ul className="space-y-1">
              {PERSISTS.map((item) => (
                <li key={item} className="text-xs text-gold-muted flex items-center gap-1">
                  <span className="text-success">&#10004;</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-[rgba(13,27,42,0.6)] border border-[rgba(45,90,61,0.3)] text-gold-muted text-sm hover:bg-[rgba(13,27,42,0.8)] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleAscend}
            disabled={!ascensionAllowed}
            className={`
              flex-1 py-2 rounded-lg font-bold text-sm transition-all
              ${ascensionAllowed
                ? 'bg-[rgba(201,168,76,0.15)] border-2 border-gold text-gold hover:bg-[rgba(201,168,76,0.3)] animate-pulse-gold'
                : 'bg-[rgba(13,27,42,0.4)] border-2 border-[rgba(45,90,61,0.15)] text-gold-muted/40 cursor-not-allowed'
              }
            `}
          >
            {ascensionAllowed ? 'Begin Ascension' : 'Insufficient Cultivation'}
          </button>
        </div>
      </div>
    </div>
  );
}
