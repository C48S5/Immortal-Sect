/**
 * DungeonSystem — Secret Realms with idle farming and push attempts.
 *
 * 5 realms: Verdant Forest/Wood, Crimson Caverns/Fire, Abyssal Grotto/Water,
 *           Iron Mountains/Metal, Earthen Depths/Earth
 *
 * Idle Farming: free, safe, rewards based on highest cleared floor, 12h cap.
 * Push Attempts: 1 Realm Key per attempt (5/day, regen 1/4h, cap 10).
 * Floor difficulty: HP=100*1.08^(floor-1), ATK=20*1.07^(floor-1), DEF=15*1.06^(floor-1)
 * Retreat: between floors=100% loot+safe, during battle=60% loot+1h injury, wipe=30% loot+permadeath
 * Boss every 10 floors with unique mechanics.
 * Ability absorption: Elite 6%, Mini-boss 15%, Realm Boss 40%
 */
import type {
  DungeonRealmState,
  DungeonRealm,
  PushResult,
  RetreatResult,
  HallElement,
} from './types';
import type { Disciple, DiscipleConfig, DiscipleStats } from '@models/disciple';

// --- Realm definitions ---

const DUNGEON_REALMS: DungeonRealm[] = [
  { id: 'verdant_forest', name: 'Verdant Forest', element: 'wood' },
  { id: 'crimson_caverns', name: 'Crimson Caverns', element: 'fire' },
  { id: 'abyssal_grotto', name: 'Abyssal Grotto', element: 'water' },
  { id: 'iron_mountains', name: 'Iron Mountains', element: 'metal' },
  { id: 'earthen_depths', name: 'Earthen Depths', element: 'earth' },
];

/** Max idle farming accumulation in seconds (12 hours) */
const MAX_IDLE_SECONDS = 43200;

/** Max realm keys */
const MAX_REALM_KEYS = 10;

/** Key regeneration interval in seconds (4 hours) */
const KEY_REGEN_INTERVAL = 14400;

/** Element advantage map: attacker element -> defender element it's strong against */
const ELEMENT_ADVANTAGE: Record<string, string> = {
  wood: 'earth',
  fire: 'metal',
  water: 'fire',
  metal: 'wood',
  earth: 'water',
};

/** Ability absorption rates */
const ABSORPTION_RATES = {
  elite: 0.06,
  miniBoss: 0.15,
  realmBoss: 0.40,
};

// --- Floor difficulty ---

export interface FloorEnemy {
  floor: number;
  hp: number;
  atk: number;
  def: number;
  isBoss: boolean;
  isElite: boolean;
  isMiniBoss: boolean;
  element: HallElement;
}

/**
 * Calculate enemy stats for a given floor.
 */
export function getFloorEnemy(
  floor: number,
  realmElement: HallElement,
): FloorEnemy {
  const hp = 100 * Math.pow(1.08, floor - 1);
  const atk = 20 * Math.pow(1.07, floor - 1);
  const def = 15 * Math.pow(1.06, floor - 1);
  const isBoss = floor % 10 === 0;
  const isMiniBoss = floor % 5 === 0 && !isBoss;
  const isElite = floor % 3 === 0 && !isBoss && !isMiniBoss;

  return {
    floor,
    hp: Math.round(hp),
    atk: Math.round(atk),
    def: Math.round(def),
    isBoss,
    isElite,
    isMiniBoss,
    element: realmElement,
  };
}

/**
 * Get all realm definitions.
 */
export function getDungeonRealms(): DungeonRealm[] {
  return DUNGEON_REALMS;
}

/**
 * Calculate element advantage multiplier.
 * Returns 1.3 for advantage, 0.7 for disadvantage, 1 for neutral.
 */
export function getElementAdvantage(
  attackerElement: string,
  defenderElement: string,
): number {
  if (ELEMENT_ADVANTAGE[attackerElement] === defenderElement) return 1.3;
  if (ELEMENT_ADVANTAGE[defenderElement] === attackerElement) return 0.7;
  return 1.0;
}

/**
 * Simulate a simple combat between a disciple and a floor enemy.
 * Returns true if the disciple wins, false otherwise.
 * This is a simplified auto-battle; real combat would be more detailed.
 */
export function simulateCombat(
  discipleStats: DiscipleStats,
  discipleElement: string,
  enemy: FloorEnemy,
): { won: boolean; hpRemaining: number } {
  const elemMult = getElementAdvantage(discipleElement, enemy.element);

  // Effective damage per turn
  const discipleDamage = Math.max(1, (discipleStats.atk * elemMult) - enemy.def * 0.5);
  const enemyDamage = Math.max(1, enemy.atk - discipleStats.def * 0.5);

  // Speed determines who attacks first; higher speed = first strike
  const discipleFirst = discipleStats.spd >= enemy.atk * 0.3;

  const turnsToKillEnemy = Math.ceil(enemy.hp / discipleDamage);
  const turnsToKillDisciple = Math.ceil(discipleStats.hp / enemyDamage);

  // If disciple goes first, they effectively get one extra "free" turn
  const effectiveTurns = discipleFirst ? turnsToKillDisciple + 1 : turnsToKillDisciple;

  const won = turnsToKillEnemy <= effectiveTurns;
  const hpRemaining = won
    ? Math.max(0, discipleStats.hp - enemyDamage * (turnsToKillEnemy - (discipleFirst ? 1 : 0)))
    : 0;

  return { won, hpRemaining };
}

/**
 * Check if ability absorption triggers for a given enemy type.
 */
export function rollAbilityAbsorption(
  enemy: FloorEnemy,
  randomValue?: number,
): boolean {
  const roll = randomValue ?? Math.random();

  if (enemy.isBoss) return roll < ABSORPTION_RATES.realmBoss;
  if (enemy.isMiniBoss) return roll < ABSORPTION_RATES.miniBoss;
  if (enemy.isElite) return roll < ABSORPTION_RATES.elite;

  return false;
}

// --- Idle Farming ---

/**
 * Calculate idle farming rewards per second based on highest floor cleared.
 * Higher floors = better rewards. Returns a reward multiplier.
 */
export function getIdleFarmingRate(highestFloor: number): number {
  if (highestFloor <= 0) return 0;
  // Base rate scales with floor: 1 + floor * 0.1
  return 1 + highestFloor * 0.1;
}

/**
 * Tick idle farming: accumulate time up to the 12h cap.
 * Returns the updated realm state and any rewards.
 */
export function tickIdleFarming(
  realmState: DungeonRealmState,
  deltaTime: number,
): { updatedState: DungeonRealmState; rewardsAccumulated: number } {
  const newAccumulated = Math.min(
    realmState.idleFarmingAccumulated + deltaTime,
    MAX_IDLE_SECONDS,
  );

  const rewardRate = getIdleFarmingRate(realmState.highestFloor);
  const rewardsThisTick = rewardRate * deltaTime;

  return {
    updatedState: { ...realmState, idleFarmingAccumulated: newAccumulated },
    rewardsAccumulated: rewardsThisTick,
  };
}

/**
 * Collect idle farming rewards and reset the accumulator.
 */
export function collectIdleRewards(
  realmState: DungeonRealmState,
): { updatedState: DungeonRealmState; totalRewards: number } {
  const rate = getIdleFarmingRate(realmState.highestFloor);
  const total = rate * realmState.idleFarmingAccumulated;

  return {
    updatedState: { ...realmState, idleFarmingAccumulated: 0 },
    totalRewards: total,
  };
}

// --- Realm Keys ---

/**
 * Tick realm key regeneration.
 */
export function tickKeyRegen(
  realmState: DungeonRealmState,
  now: number,
): DungeonRealmState {
  if (realmState.realmKeys >= MAX_REALM_KEYS) {
    return { ...realmState, lastKeyRegenTime: now };
  }

  const elapsed = now - realmState.lastKeyRegenTime;
  const keysToAdd = Math.floor(elapsed / KEY_REGEN_INTERVAL);

  if (keysToAdd <= 0) return realmState;

  const newKeys = Math.min(realmState.realmKeys + keysToAdd, MAX_REALM_KEYS);
  const newLastRegen = realmState.lastKeyRegenTime + keysToAdd * KEY_REGEN_INTERVAL;

  return {
    ...realmState,
    realmKeys: newKeys,
    lastKeyRegenTime: newLastRegen,
  };
}

// --- Push Attempts ---

/**
 * Start a push attempt. Consumes 1 realm key.
 * Simulates combat floor by floor until defeat or retreat.
 */
export function startPushAttempt(
  realmState: DungeonRealmState,
  _disciple: Disciple,
  discipleConfig: DiscipleConfig,
  maxFloors: number = 5,
): PushResult {
  if (realmState.realmKeys <= 0) {
    return {
      floorsCleared: 0,
      loot: [],
      abilityAbsorbed: null,
      retreatResult: null,
      bossDefeated: false,
    };
  }

  const realm = DUNGEON_REALMS.find(r => r.id === realmState.realmId);
  const realmElement = realm?.element ?? 'neutral';

  let currentFloor = realmState.highestFloor + 1;
  let floorsCleared = 0;
  let abilityAbsorbed: string | null = null;
  let bossDefeated = false;
  let currentHp = discipleConfig.stats.hp;

  for (let i = 0; i < maxFloors; i++) {
    const enemy = getFloorEnemy(currentFloor, realmElement);

    const adjustedStats: DiscipleStats = {
      ...discipleConfig.stats,
      hp: currentHp,
    };

    const result = simulateCombat(adjustedStats, discipleConfig.root, enemy);

    if (!result.won) {
      // Wipe on this floor
      return {
        floorsCleared,
        loot: generateLoot(floorsCleared, realmState.highestFloor),
        abilityAbsorbed,
        retreatResult: {
          lootPercentage: 0.3,
          injuryDuration: -1, // permadeath
          message: `${discipleConfig.name} was defeated on floor ${currentFloor}. Permadeath triggered.`,
        },
        bossDefeated: false,
      };
    }

    currentHp = result.hpRemaining;
    floorsCleared++;

    // Check ability absorption
    if (rollAbilityAbsorption(enemy)) {
      abilityAbsorbed = `Ability from floor ${currentFloor}`;
    }

    if (enemy.isBoss) {
      bossDefeated = true;
    }

    currentFloor++;
  }

  return {
    floorsCleared,
    loot: generateLoot(floorsCleared, realmState.highestFloor),
    abilityAbsorbed,
    retreatResult: {
      lootPercentage: 1.0,
      injuryDuration: 0,
      message: `Cleared ${floorsCleared} floors safely.`,
    },
    bossDefeated,
  };
}

/**
 * Retreat during a push attempt.
 */
export function retreat(
  inBattle: boolean,
): RetreatResult {
  if (!inBattle) {
    // Between floors: safe retreat
    return {
      lootPercentage: 1.0,
      injuryDuration: 0,
      message: 'Safe retreat between floors. All loot kept.',
    };
  }

  // During battle: 60% loot, 1h injury
  return {
    lootPercentage: 0.6,
    injuryDuration: 3600,
    message: 'Emergency retreat during battle. 60% loot kept, 1h injury.',
  };
}

/**
 * Generate loot for cleared floors.
 */
function generateLoot(
  floorsCleared: number,
  _baseFloor: number,
): { itemId: string; quantity: number }[] {
  if (floorsCleared <= 0) return [];

  // Simplified loot: RT and QR based on floors cleared
  const loot: { itemId: string; quantity: number }[] = [
    { itemId: 'recruitment_token', quantity: Math.ceil(floorsCleared / 3) },
  ];

  // Bonus loot for deeper floors
  if (floorsCleared >= 5) {
    loot.push({ itemId: 'qi_residue', quantity: floorsCleared });
  }

  return loot;
}

/**
 * Initialize default dungeon realm states.
 */
export function createDefaultDungeonStates(now: number): DungeonRealmState[] {
  return DUNGEON_REALMS.map(realm => ({
    realmId: realm.id,
    highestFloor: 0,
    currentFloor: 0,
    idleFarmingAccumulated: 0,
    realmKeys: 5,
    lastKeyRegenTime: now,
  }));
}

/**
 * Get time until next key regeneration.
 */
export function getTimeUntilNextKey(realmState: DungeonRealmState, now: number): number {
  if (realmState.realmKeys >= MAX_REALM_KEYS) return 0;
  const elapsed = now - realmState.lastKeyRegenTime;
  return Math.max(0, KEY_REGEN_INTERVAL - (elapsed % KEY_REGEN_INTERVAL));
}
