/**
 * DaoPathSystem — 5 Dao faction paths with passive bonuses and active spells.
 *
 * Paths:
 *   1. Sword Dao     — boosts combat halls, Sword Storm spell
 *   2. Alchemy Dao   — boosts alchemy halls, Golden Core Overflow spell
 *   3. Formation Dao — boosts formation halls, Barrier Seal spell
 *   4. Heavenly Dao  — boosts all halls mildly, Heavenly Tribulation spell
 *   5. Beast Dao     — boosts beast halls, Beast Stampede spell
 *
 * Each path grants x3 to its boosted halls, x1 to others.
 */
import type {
  DaoPathConfig,
  DaoPathState,
  SpellResult,
  PassiveEffect,
  SpellActiveState,
} from './types';
import { DAO_PATH_CONFIGS } from '@data/daoPathConfigs';

/** Get a path config by ID. */
export function getPathConfig(pathId: number): DaoPathConfig | undefined {
  return DAO_PATH_CONFIGS.find(p => p.id === pathId);
}

/** Get all path configs. */
export function getAllPathConfigs(): readonly DaoPathConfig[] {
  return DAO_PATH_CONFIGS;
}

/**
 * Select a Dao Path. Returns the new DaoPathState.
 * Path selection persists through Ascension.
 */
export function selectPath(pathId: number, _currentState: DaoPathState): DaoPathState {
  const config = getPathConfig(pathId);
  if (!config) return _currentState;

  return {
    selectedPathId: pathId,
    spellActive: false,
    spellRemainingDuration: 0,
    spellCooldownRemaining: 0,
  };
}

/**
 * Get the hall multiplier for a specific hall based on the selected path.
 * Returns x3 for boosted halls, x1 for others.
 */
export function getPathMultiplier(hallId: number, pathId: number | null): number {
  if (pathId === null) return 1;

  const config = getPathConfig(pathId);
  if (!config) return 1;

  return config.boostedHallIds.includes(hallId) ? config.hallMultiplier : 1;
}

/**
 * Get the passive bonus for the selected path.
 */
export function getPassiveBonus(pathId: number | null): PassiveEffect | null {
  if (pathId === null) return null;

  const config = getPathConfig(pathId);
  if (!config) return null;

  const PASSIVE_MAP: Record<number, PassiveEffect> = {
    1: { type: 'cycleReduction', value: config.passiveValue, description: config.passiveDescription },
    2: { type: 'aeReduction', value: config.passiveValue, description: config.passiveDescription },
    3: { type: 'treasureBonus', value: config.passiveValue, description: config.passiveDescription },
    4: { type: 'hdpBonus', value: config.passiveValue, description: config.passiveDescription },
    5: { type: 'realmKeyRegen', value: config.passiveValue, description: config.passiveDescription },
  };

  return PASSIVE_MAP[pathId] ?? null;
}

/**
 * Attempt to activate the selected path's spell.
 * Returns a SpellResult indicating success/failure and spell parameters.
 */
export function activateSpell(
  state: DaoPathState,
): SpellResult {
  if (state.selectedPathId === null) {
    return { success: false, spellName: '', duration: 0, cooldown: 0, message: 'No Dao Path selected.' };
  }

  if (state.spellActive) {
    return { success: false, spellName: '', duration: 0, cooldown: 0, message: 'Spell is already active.' };
  }

  if (state.spellCooldownRemaining > 0) {
    return {
      success: false,
      spellName: '',
      duration: 0,
      cooldown: state.spellCooldownRemaining,
      message: `Spell on cooldown: ${Math.ceil(state.spellCooldownRemaining)}s remaining.`,
    };
  }

  const config = getPathConfig(state.selectedPathId);
  if (!config) {
    return { success: false, spellName: '', duration: 0, cooldown: 0, message: 'Invalid path.' };
  }

  return {
    success: true,
    spellName: config.spell.name,
    duration: config.spell.activeDuration,
    cooldown: config.spell.cooldown,
    message: `${config.spell.name} activated! ${config.spell.effectDescription}`,
  };
}

/**
 * Tick the spell state: decrement active duration and cooldown.
 * Returns updated DaoPathState.
 */
export function tickSpell(state: DaoPathState, deltaTime: number): DaoPathState {
  let { spellActive, spellRemainingDuration, spellCooldownRemaining } = state;

  if (spellActive && spellRemainingDuration > 0) {
    spellRemainingDuration = Math.max(0, spellRemainingDuration - deltaTime);
    if (spellRemainingDuration <= 0) {
      spellActive = false;
      // Cooldown starts when spell ends
      const config = getPathConfig(state.selectedPathId!);
      if (config) {
        spellCooldownRemaining = config.spell.cooldown;
      }
    }
  } else if (spellCooldownRemaining > 0) {
    spellCooldownRemaining = Math.max(0, spellCooldownRemaining - deltaTime);
  }

  return {
    ...state,
    spellActive,
    spellRemainingDuration,
    spellCooldownRemaining,
  };
}

/**
 * Compute the active spell effect on hall multipliers.
 * This is called each tick when a spell is active to determine real-time effects.
 */
export function computeSpellEffects(
  state: DaoPathState,
  hallCount: number,
  randomSeed?: number,
): SpellActiveState {
  const base: SpellActiveState = {
    hallMultipliers: {},
    globalMultiplier: 1,
    aeMultiplier: 1,
    treasureRateMultiplier: 1,
  };

  if (!state.spellActive || state.selectedPathId === null) {
    return base;
  }

  const config = getPathConfig(state.selectedPathId);
  if (!config) return base;

  // Use a simple seeded random for deterministic results in tests
  let seed = randomSeed;
  const rng = seed !== undefined
    ? () => {
        const x = Math.sin(seed!++) * 10000;
        return x - Math.floor(x);
      }
    : Math.random;

  switch (state.selectedPathId) {
    case 1: {
      // Sword Storm: random hall gets random x1-x10
      const hallId = Math.floor(rng() * hallCount) + 1;
      const mult = 1 + Math.floor(rng() * 10); // 1-10
      base.hallMultipliers[hallId] = mult;
      break;
    }
    case 2: {
      // Golden Core Overflow: AE generation x3
      base.aeMultiplier = 3;
      break;
    }
    case 3: {
      // Barrier Seal: ramp from x0.5 to x2 over 120s
      const totalDuration = config.spell.activeDuration;
      const elapsed = totalDuration - state.spellRemainingDuration;
      const progress = Math.min(elapsed / totalDuration, 1);
      // Linear ramp: 0.5 + 1.5 * progress
      const mult = 0.5 + 1.5 * progress;
      // Apply to a "locked" hall (hall 1 by default, could be chosen)
      const lockedHall = Math.floor(rng() * hallCount) + 1;
      base.hallMultipliers[lockedHall] = mult;
      break;
    }
    case 4: {
      // Heavenly Tribulation: 50% x10 all OR x0 for 5s then x5 for 5s
      const totalDuration = config.spell.activeDuration;
      const elapsed = totalDuration - state.spellRemainingDuration;
      const lucky = rng() >= 0.5;

      if (lucky) {
        base.globalMultiplier = 10;
      } else {
        // First 5 seconds = x0, last 5 seconds = x5
        base.globalMultiplier = elapsed < 5 ? 0 : 5;
      }
      break;
    }
    case 5: {
      // Beast Stampede: treasure spawn rate x5
      base.treasureRateMultiplier = 5;
      break;
    }
  }

  return base;
}
