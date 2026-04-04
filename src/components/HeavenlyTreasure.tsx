import { useState, useEffect, useRef, useCallback } from 'react';

interface TreasureInstance {
  id: number;
  type: 'sword' | 'phoenix' | 'pearl' | 'scroll';
  y: number;
  collected: boolean;
  spawnedAt: number;
}

const TREASURE_ICONS: Record<TreasureInstance['type'], string> = {
  sword: '&#9876;',
  phoenix: '&#127748;',
  pearl: '&#128310;',
  scroll: '&#128220;',
};

const TREASURE_TYPES: TreasureInstance['type'][] = ['sword', 'phoenix', 'pearl', 'scroll'];

interface HeavenlyTreasureProps {
  onCollect: () => void;
}

export function HeavenlyTreasure({ onCollect }: HeavenlyTreasureProps) {
  const [treasures, setTreasures] = useState<TreasureInstance[]>([]);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const idCounter = useRef(0);
  const spawnTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const spawnTreasure = useCallback(() => {
    const newTreasure: TreasureInstance = {
      id: idCounter.current++,
      type: TREASURE_TYPES[Math.floor(Math.random() * TREASURE_TYPES.length)],
      y: 15 + Math.random() * 60,
      collected: false,
      spawnedAt: Date.now(),
    };
    setTreasures((prev) => [...prev.slice(-3), newTreasure]); // Keep max 4

    // Spawn every 15-30 seconds (faster than GDD's 30-60s for better pacing)
    const nextDelay = 15000 + Math.random() * 15000;
    spawnTimer.current = setTimeout(spawnTreasure, nextDelay);
  }, []);

  useEffect(() => {
    // First spawn in 10-20 seconds
    const initialDelay = 10000 + Math.random() * 10000;
    spawnTimer.current = setTimeout(spawnTreasure, initialDelay);
    return () => clearTimeout(spawnTimer.current);
  }, [spawnTreasure]);

  // Clean up expired treasures (after 8s animation)
  useEffect(() => {
    const cleanup = setInterval(() => {
      setTreasures((prev) =>
        prev.filter((t) => !t.collected && Date.now() - t.spawnedAt < 9000)
      );
    }, 10000);
    return () => clearInterval(cleanup);
  }, []);

  // Clean up sparkles
  useEffect(() => {
    if (sparkles.length === 0) return;
    const timer = setTimeout(() => {
      setSparkles([]);
    }, 500);
    return () => clearTimeout(timer);
  }, [sparkles]);

  const handleClick = (treasure: TreasureInstance, e: React.MouseEvent) => {
    if (treasure.collected) return;
    setTreasures((prev) =>
      prev.map((t) => (t.id === treasure.id ? { ...t, collected: true } : t))
    );

    // Create sparkle effect
    setSparkles([{
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    }]);

    onCollect();
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {treasures.map((treasure) => {
        if (treasure.collected) return null;
        return (
          <div
            key={treasure.id}
            className="absolute pointer-events-auto cursor-pointer animate-treasure-float"
            style={{ top: `${treasure.y}%` }}
            onClick={(e) => handleClick(treasure, e)}
          >
            <div className="animate-treasure-wave text-2xl select-none filter drop-shadow-[0_0_8px_rgba(201,168,76,0.6)]">
              <span dangerouslySetInnerHTML={{ __html: TREASURE_ICONS[treasure.type] }} />
            </div>
          </div>
        );
      })}

      {/* Sparkle effects */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute pointer-events-none animate-sparkle"
          style={{ left: sparkle.x - 10, top: sparkle.y - 10 }}
        >
          <div className="w-5 h-5 rounded-full bg-gold opacity-80" />
        </div>
      ))}
    </div>
  );
}
