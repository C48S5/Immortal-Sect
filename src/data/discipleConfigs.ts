import { Rarity, SpiritualRoot } from '../models/disciple';
import type { DiscipleConfig, GachaConfig, PullRateConfig } from '../models/disciple';

/** Pull rate configuration for each rarity tier */
export const PULL_RATES: readonly PullRateConfig[] = [
  { rarity: Rarity.Common, rate: 0.52, abilitySlots: 1, qiResidueOnDeath: 1, rarityMultiplier: 1.05 },
  { rarity: Rarity.Uncommon, rate: 0.25, abilitySlots: 1, qiResidueOnDeath: 3, rarityMultiplier: 1.12 },
  { rarity: Rarity.Rare, rate: 0.15, abilitySlots: 2, qiResidueOnDeath: 0, rarityMultiplier: 1.25 },
  { rarity: Rarity.Epic, rate: 0.06, abilitySlots: 2, qiResidueOnDeath: 0, rarityMultiplier: 1.50 },
  { rarity: Rarity.Legendary, rate: 0.02, abilitySlots: 3, qiResidueOnDeath: 0, rarityMultiplier: 2.00 },
];

/** Gacha system configuration */
export const GACHA_CONFIG: GachaConfig = {
  singlePullCost: 300,
  tenPullCost: 2700,
  hardPityPulls: 50,
  sparkPulls: 300,
  pullRates: [...PULL_RATES],
};

/** Element matching bonus when a disciple's root matches the hall element */
export const ELEMENT_MATCH_MULTIPLIER = 2.0;

/** Flat element bonus for neutral halls (Halls 1 and 12) */
export const NEUTRAL_HALL_ELEMENT_BONUS = 1.25;

/** Trait matching bonus when a disciple has a trait matching their assigned hall */
export const TRAIT_MATCH_MULTIPLIER = 1.25;

/** All 15 disciple template configurations */
export const DISCIPLE_CONFIGS: readonly DiscipleConfig[] = [
  // ═══ COMMON (Gray) ═══
  {
    id: 'li-fen',
    name: 'Li Fen',
    chineseName: '李奋',
    rarity: Rarity.Common,
    root: SpiritualRoot.Fire,
    stats: { hp: 95, atk: 110, def: 80, spd: 90 },
    abilitySlots: 1,
    hallPassive: { description: '+3% Alchemy Furnace speed' },
    combatAbility: { name: 'Flame Fist', description: '120% ATK to single target' },
    lore: 'A countryside orphan who taught herself cultivation by watching sect disciples through a crack in the wall.',
  },
  {
    id: 'zhou-mu',
    name: 'Zhou Mu',
    chineseName: '周木',
    rarity: Rarity.Common,
    root: SpiritualRoot.Wood,
    stats: { hp: 100, atk: 85, def: 90, spd: 115 },
    abilitySlots: 1,
    hallPassive: { description: '+3% Spirit Beast Garden income' },
    combatAbility: { name: 'Vine Whip', description: '80% ATK to all enemies, 10% slow' },
    lore: 'A former herbalist\'s apprentice who can identify three hundred spirit herbs by scent alone.',
  },
  {
    id: 'chen-gang',
    name: 'Chen Gang',
    chineseName: '陈刚',
    rarity: Rarity.Common,
    root: SpiritualRoot.Earth,
    stats: { hp: 130, atk: 75, def: 110, spd: 70 },
    abilitySlots: 1,
    hallPassive: { description: '+3% Formation Array Hall DEF bonus' },
    combatAbility: { name: 'Stone Shield', description: 'Absorb 200% DEF as damage for 5s' },
    lore: 'A miner who accidentally broke through to Qi Condensation after years of hauling spirit ore.',
  },

  // ═══ UNCOMMON (Green) ═══
  {
    id: 'mei-shuang',
    name: 'Mei Shuang',
    chineseName: '梅霜',
    rarity: Rarity.Uncommon,
    root: SpiritualRoot.Water,
    stats: { hp: 150, atk: 120, def: 140, spd: 110 },
    abilitySlots: 1,
    hallPassive: { description: '+8% Void Meditation Sanctum offline earnings' },
    combatAbility: { name: 'Frost Nova', description: '90% ATK AoE + 15% freeze chance' },
    lore: 'Raised in a waterfall monastery, she meditates under cascading ice every morning before dawn.',
  },
  {
    id: 'guo-jin',
    name: 'Guo Jin',
    chineseName: '郭金',
    rarity: Rarity.Uncommon,
    root: SpiritualRoot.Metal,
    stats: { hp: 120, atk: 165, def: 100, spd: 130 },
    abilitySlots: 1,
    hallPassive: { description: '+8% Sword Refinement Peak income' },
    combatAbility: { name: 'Sword Qi Slash', description: '150% ATK to front row' },
    lore: 'A wandering swordsman who dueled forty-seven opponents before finding a sect worthy of his blade.',
  },
  {
    id: 'tian-lei',
    name: 'Tian Lei',
    chineseName: '田雷',
    rarity: Rarity.Uncommon,
    root: SpiritualRoot.Fire,
    stats: { hp: 140, atk: 155, def: 110, spd: 115 },
    abilitySlots: 1,
    hallPassive: { description: '+8% Tribulation Lightning Tower HDP bonus' },
    combatAbility: { name: 'Thunder Palm', description: '130% ATK + 20% stun' },
    lore: 'Born during a thunderstorm with scorch marks on both palms — the midwife called it Heaven\'s brand.',
  },

  // ═══ RARE (Blue) ═══
  {
    id: 'lin-qinghe',
    name: 'Lin Qinghe',
    chineseName: '林清河',
    rarity: Rarity.Rare,
    root: SpiritualRoot.Water,
    stats: { hp: 210, atk: 175, def: 195, spd: 160 },
    abilitySlots: 2,
    hallPassive: { description: '+15% Qi Gathering Pavilion speed + 5% AE generation' },
    combatAbility: { name: 'Tidal Surge', description: '200% ATK wave hits all enemies, heals allies 5% HP' },
    lore: 'The daughter of a river spirit and a mortal scholar, she hears the Dao in flowing water.',
  },
  {
    id: 'bai-yue',
    name: 'Bai Yue',
    chineseName: '白月',
    rarity: Rarity.Rare,
    root: SpiritualRoot.Wood,
    stats: { hp: 200, atk: 190, def: 170, spd: 200 },
    abilitySlots: 2,
    hallPassive: { description: '+15% Spirit Beast Garden income + Heavenly Treasure freq x1.1' },
    combatAbility: { name: 'Moonvine Binding', description: 'Root 2 enemies for 3s + 150% ATK poison over 6s' },
    lore: 'Cultivates only under moonlight; her techniques grow 30% stronger between midnight and dawn.',
  },
  {
    id: 'huo-yan',
    name: 'Huo Yan',
    chineseName: '火焰',
    rarity: Rarity.Rare,
    root: SpiritualRoot.Fire,
    stats: { hp: 180, atk: 240, def: 150, spd: 175 },
    abilitySlots: 2,
    hallPassive: { description: '+15% Alchemy Furnace AE production + 10% pill potency' },
    combatAbility: { name: 'Inferno Blast', description: '280% ATK to single target + burn for 100% ATK over 4s' },
    lore: 'A prodigy expelled from three sects for burning down their pill refineries. The fourth time\'s the charm.',
  },

  // ═══ EPIC (Purple) ═══
  {
    id: 'xiao-wuji',
    name: 'Xiao Wuji',
    chineseName: '萧无极',
    rarity: Rarity.Epic,
    root: SpiritualRoot.Metal,
    stats: { hp: 280, atk: 350, def: 220, spd: 260 },
    abilitySlots: 2,
    hallPassive: { description: '+30% Sword Refinement Peak profit + x1.2 Dao Path amplifier' },
    combatAbility: { name: 'Ten Thousand Swords Return', description: '300% ATK to all + 30% DEF shred for 5s' },
    lore: 'He comprehended the Sword Dao at age nine by watching falling autumn leaves — each one a blade.',
  },
  {
    id: 'yun-shui',
    name: 'Yun Shui',
    chineseName: '云水',
    rarity: Rarity.Epic,
    root: SpiritualRoot.Earth,
    stats: { hp: 380, atk: 250, def: 340, spd: 200 },
    abilitySlots: 2,
    hallPassive: { description: '+30% Formation Array Hall cost reduction (additional -3%)' },
    combatAbility: { name: 'Mountain Sovereign Domain', description: 'All allies gain +25% DEF for 8s + taunt all enemies' },
    lore: 'An ancient cultivator who slept inside a mountain for three centuries and emerged unchanged.',
  },
  {
    id: 'hua-lian',
    name: 'Hua Lian',
    chineseName: '花莲',
    rarity: Rarity.Epic,
    root: SpiritualRoot.Wood,
    stats: { hp: 300, atk: 280, def: 260, spd: 310 },
    abilitySlots: 2,
    hallPassive: { description: '+30% Talisman Inscription Studio duration + 20% all pill durations' },
    combatAbility: { name: 'Forest\'s Blessing', description: 'Heal all allies 15% max HP + cleanse debuffs + 180% ATK thorns for 6s' },
    lore: 'She cultivates by growing a lotus from seed to bloom in a single breath — each petal a sutra.',
  },

  // ═══ LEGENDARY (Gold) ═══
  {
    id: 'jian-wuchen',
    name: 'Jian Wuchen',
    chineseName: '剑无尘',
    rarity: Rarity.Legendary,
    root: SpiritualRoot.Metal,
    stats: { hp: 420, atk: 520, def: 310, spd: 400 },
    abilitySlots: 3,
    hallPassive: { description: 'x1.5 Sword Refinement Peak income + x1.3 ALL hall speed' },
    combatAbility: {
      name: 'Heavenly Sword Domain',
      description: '500% ATK to all enemies over 5s + ignore 50% DEF. If an enemy dies, extend duration 2s.',
    },
    lore: 'Once the youngest Sword Saint in nine heavens — he shattered his own golden core to save his sect, then rebuilt it from nothing.',
  },
  {
    id: 'feng-huangyu',
    name: 'Feng Huangyu',
    chineseName: '凤凰羽',
    rarity: Rarity.Legendary,
    root: SpiritualRoot.Fire,
    stats: { hp: 450, atk: 480, def: 280, spd: 380 },
    abilitySlots: 3,
    hallPassive: { description: 'x1.5 Alchemy Furnace income + AE generation x1.5 + 25% pill potency' },
    combatAbility: {
      name: 'Phoenix Rebirth Flame',
      description: '400% ATK AoE. If any ally would die within 8s, revive them at 30% HP (once per battle).',
    },
    lore: 'Found as an infant in a nest of phoenix ashes. Her hair turns white-gold when she burns at full power.',
  },
  {
    id: 'gui-xu',
    name: 'Gui Xu',
    chineseName: '归墟',
    rarity: Rarity.Legendary,
    root: SpiritualRoot.Water,
    stats: { hp: 500, atk: 350, def: 450, spd: 340 },
    abilitySlots: 3,
    hallPassive: { description: 'x1.5 Void Meditation Sanctum income + offline earnings x1.3 + x1.2 Mandate effectiveness' },
    combatAbility: {
      name: 'Abyss of Returning Ruins',
      description: 'All enemies take 200% ATK/s for 6s + heal reduction 80%. Allies gain 10% lifesteal.',
    },
    lore: 'He sat at the bottom of the Returning Ruins Sea for forty years, listening to the Dao echo off the bones of drowned immortals.',
  },
];

/**
 * Spiritual root strengths and weaknesses.
 * Key = root, value = { strength description, weakness element, stat bonus }
 */
export const SPIRITUAL_ROOT_DATA: Record<SpiritualRoot, {
  strengthDescription: string;
  weakness: SpiritualRoot;
  statBonus: { stat: string; percent: number };
}> = {
  [SpiritualRoot.Fire]: {
    strengthDescription: '+15% ATK, burst damage',
    weakness: SpiritualRoot.Water,
    statBonus: { stat: 'atk', percent: 15 },
  },
  [SpiritualRoot.Water]: {
    strengthDescription: '+12% DEF, sustain/healing',
    weakness: SpiritualRoot.Wood,
    statBonus: { stat: 'def', percent: 12 },
  },
  [SpiritualRoot.Wood]: {
    strengthDescription: '+15% SPD, evasion/poison',
    weakness: SpiritualRoot.Metal,
    statBonus: { stat: 'spd', percent: 15 },
  },
  [SpiritualRoot.Metal]: {
    strengthDescription: '+15% CRIT, precision strikes',
    weakness: SpiritualRoot.Fire,
    statBonus: { stat: 'crit', percent: 15 },
  },
  [SpiritualRoot.Earth]: {
    strengthDescription: '+20% HP, tankiness',
    weakness: SpiritualRoot.Wood,
    statBonus: { stat: 'hp', percent: 20 },
  },
};

/** Elemental advantage damage bonus (dealt) */
export const ELEMENTAL_ADVANTAGE_DAMAGE_BONUS = 0.25;

/** Elemental advantage damage reduction (taken) */
export const ELEMENTAL_ADVANTAGE_DAMAGE_REDUCTION = 0.15;

/**
 * Hall element assignments for disciple matching.
 * Maps hall ID to its element and matching spiritual root.
 */
export const HALL_ELEMENT_MAP: Record<number, {
  element: string;
  matchingRoot: SpiritualRoot | 'any';
}> = {
  1: { element: 'neutral', matchingRoot: 'any' },
  2: { element: 'earth', matchingRoot: SpiritualRoot.Earth },
  3: { element: 'fire', matchingRoot: SpiritualRoot.Fire },
  4: { element: 'earth', matchingRoot: SpiritualRoot.Earth },
  5: { element: 'wood', matchingRoot: SpiritualRoot.Wood },
  6: { element: 'metal', matchingRoot: SpiritualRoot.Metal },
  7: { element: 'metal', matchingRoot: SpiritualRoot.Metal },
  8: { element: 'fire', matchingRoot: SpiritualRoot.Fire },
  9: { element: 'water', matchingRoot: SpiritualRoot.Water },
  10: { element: 'water', matchingRoot: SpiritualRoot.Water },
  11: { element: 'wood', matchingRoot: SpiritualRoot.Wood },
  12: { element: 'neutral', matchingRoot: 'any' },
};
