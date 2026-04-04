/**
 * Game Systems — Pure computation modules that read state and return results.
 * Systems have no side effects; stores apply the returned values.
 */

// Shared types used across systems
export * from './types';

// Revenue calculation (master formula)
export * as RevenueCalculator from './RevenueCalculator';

// Milestone tracking and bonuses
export * as MilestoneSystem from './MilestoneSystem';

// Dao Path factions and spells
export * as DaoPathSystem from './DaoPathSystem';

// Alchemy crafting and buffs
export * as AlchemySystem from './AlchemySystem';

// Progressive autobuyers
export * as AutomationSystem from './AutomationSystem';

// Tribulation challenges
export * as ChallengeSystem from './ChallengeSystem';

// Heavenly Mandate upgrades
export * as MandateSystem from './MandateSystem';

// Disciple gacha and assignment
export * as DiscipleSystem from './DiscipleSystem';

// Secret Realms (dungeon)
export * as DungeonSystem from './DungeonSystem';

// Permadeath legacy and Qi Residue shop
export * as LegacySystem from './LegacySystem';
