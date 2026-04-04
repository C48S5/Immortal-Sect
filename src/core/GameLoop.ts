/**
 * Game tick engine for Cultivation Sect Tycoon.
 * Runs at 20Hz (50ms per tick) using requestAnimationFrame.
 * Dispatches React re-renders at 4Hz (every 5th tick).
 */

const TARGET_TICK_MS = 50; // 20Hz
const RENDER_EVERY_N_TICKS = 5; // 4Hz re-render
const MAX_DELTA_TIME_S = 1.0; // Cap delta to prevent speed hacking

/** Tick phase callbacks */
export interface TickCallbacks {
  updateCycles: (dt: number) => void;
  checkMilestones: () => void;
  updateAutomation: (dt: number) => void;
  applyBuffs: () => void;
}

/** Performance stats exposed to the UI */
export interface LoopStats {
  tickCount: number;
  avgTickTimeMs: number;
  fps: number;
  isPaused: boolean;
  isRunning: boolean;
}

// Module-level state
let animFrameId: number | null = null;
let isPaused = false;
let isRunning = false;
let lastTimestamp = 0;
let accumulator = 0;
let tickCount = 0;
let ticksSinceRender = 0;

// Performance tracking
let tickTimeSamples: number[] = [];
const MAX_SAMPLES = 60;

let onTickRef: TickCallbacks | null = null;
let onRenderRef: (() => void) | null = null;

function recordTickTime(ms: number): void {
  tickTimeSamples.push(ms);
  if (tickTimeSamples.length > MAX_SAMPLES) {
    tickTimeSamples.shift();
  }
}

function getAvgTickTime(): number {
  if (tickTimeSamples.length === 0) return 0;
  const sum = tickTimeSamples.reduce((a, b) => a + b, 0);
  return sum / tickTimeSamples.length;
}

function loop(timestamp: number): void {
  if (!isRunning) return;

  animFrameId = requestAnimationFrame(loop);

  if (lastTimestamp === 0) {
    lastTimestamp = timestamp;
    return;
  }

  const rawDeltaMs = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  if (isPaused) return;

  accumulator += rawDeltaMs;

  // Process as many fixed ticks as accumulated time allows
  while (accumulator >= TARGET_TICK_MS) {
    accumulator -= TARGET_TICK_MS;

    const dt = Math.min(TARGET_TICK_MS / 1000, MAX_DELTA_TIME_S);
    const tickStart = performance.now();

    if (onTickRef) {
      // Phase 1: Update cycle progress on all halls
      onTickRef.updateCycles(dt);
      // Phase 2: Check milestone thresholds
      onTickRef.checkMilestones();
      // Phase 3: Update automation (elder-run halls)
      onTickRef.updateAutomation(dt);
      // Phase 4: Apply active buffs
      onTickRef.applyBuffs();
    }

    const tickEnd = performance.now();
    recordTickTime(tickEnd - tickStart);
    tickCount++;
    ticksSinceRender++;

    // Dispatch render at 4Hz
    if (ticksSinceRender >= RENDER_EVERY_N_TICKS) {
      ticksSinceRender = 0;
      if (onRenderRef) {
        onRenderRef();
      }
    }
  }
}

/**
 * Start the game loop.
 * @param onTick - Callbacks for each tick phase
 * @param onRender - Called at 4Hz for React re-renders
 */
export function startGameLoop(
  onTick: TickCallbacks,
  onRender: () => void,
): void {
  if (isRunning) return;

  onTickRef = onTick;
  onRenderRef = onRender;
  isRunning = true;
  isPaused = false;
  lastTimestamp = 0;
  accumulator = 0;
  ticksSinceRender = 0;

  animFrameId = requestAnimationFrame(loop);
}

/** Stop the game loop entirely. */
export function stopGameLoop(): void {
  isRunning = false;
  isPaused = false;
  if (animFrameId !== null) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  onTickRef = null;
  onRenderRef = null;
  lastTimestamp = 0;
  accumulator = 0;
}

/** Pause the game loop (keeps rAF running but skips ticks). */
export function pauseGameLoop(): void {
  isPaused = true;
}

/** Resume the game loop from pause. */
export function resumeGameLoop(): void {
  if (!isRunning) return;
  isPaused = false;
  // Reset timestamp to avoid large delta spike after unpause
  lastTimestamp = 0;
  accumulator = 0;
}

/** Get current loop performance stats. */
export function getLoopStats(): LoopStats {
  return {
    tickCount,
    avgTickTimeMs: Math.round(getAvgTickTime() * 100) / 100,
    fps: getAvgTickTime() > 0 ? Math.round(1000 / TARGET_TICK_MS) : 0,
    isPaused,
    isRunning,
  };
}
