import { useState, useEffect, useRef } from 'react';
import { formatNumber, D } from '@core/BigNumber';
import Decimal from 'break_infinity.js';

interface OfflineReturnScreenProps {
  offlineSeconds: number;
  spiritStonesEarned: Decimal;
  onCollect: (multiplier: number) => void;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

export function OfflineReturnScreen({ offlineSeconds, spiritStonesEarned, onCollect }: OfflineReturnScreenProps) {
  const [displayAmount, setDisplayAmount] = useState(D(0));
  const [animating, setAnimating] = useState(true);
  const animRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Animate counter from 0 to total
  useEffect(() => {
    const steps = 40;
    let step = 0;
    const increment = spiritStonesEarned.div(steps);

    animRef.current = setInterval(() => {
      step++;
      if (step >= steps) {
        setDisplayAmount(spiritStonesEarned);
        setAnimating(false);
        clearInterval(animRef.current);
        return;
      }
      setDisplayAmount(increment.mul(step));
    }, 40);

    return () => clearInterval(animRef.current);
  }, [spiritStonesEarned]);

  // Stars
  const stars = useRef(
    Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      size: 0.5 + Math.random() * 2,
    }))
  );

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.95)] flex items-center justify-center overflow-hidden">
      {/* Starfield */}
      {stars.current.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/60 animate-twinkle"
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
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={`qi-${i}`}
          className="absolute w-1 h-1 rounded-full bg-[#2ba695] animate-qi-particle"
          style={{
            left: `${15 + Math.random() * 70}%`,
            animationDelay: `${i * 0.75}s`,
          }}
        />
      ))}

      {/* Mountain silhouette */}
      <div className="absolute bottom-0 w-full opacity-15">
        <svg viewBox="0 0 400 100" className="w-full h-24">
          <polygon
            points="0,100 30,40 80,60 130,20 180,50 230,10 280,35 330,25 380,45 400,55 400,100"
            fill="#4a9968"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center animate-fade-in max-w-md">
        <h2 className="text-2xl font-bold text-gold mb-3">Welcome Back, Sect Master</h2>

        <p className="text-sm text-gold-muted mb-6">
          Your sect cultivated for{' '}
          <span className="text-warm-white font-bold">{formatDuration(offlineSeconds)}</span>
        </p>

        <div className="p-4 rounded-xl bg-[rgba(13,27,42,0.8)] border border-[rgba(45,90,61,0.3)] mb-6">
          <p className="text-xs text-gold-muted mb-1">Spirit Stones Earned</p>
          <p className={`text-3xl font-bold font-mono text-jade ${animating ? 'animate-count-up' : ''}`}>
            {formatNumber(displayAmount)} SS
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => onCollect(1)}
            className="px-8 py-3 rounded-lg bg-[rgba(45,90,61,0.15)] border-2 border-[#4a9968] text-jade font-bold hover:bg-[rgba(45,90,61,0.3)] transition-all"
          >
            Gather (x1)
          </button>
          <button
            onClick={() => onCollect(2)}
            className="px-8 py-3 rounded-lg bg-[rgba(201,168,76,0.15)] border-2 border-gold text-gold font-bold hover:bg-[rgba(201,168,76,0.3)] transition-all animate-pulse-gold"
          >
            Cultivate with Insight (x2)
          </button>
        </div>
      </div>
    </div>
  );
}
