import Decimal from 'break_infinity.js';

/** All currency types in the game */
export enum CurrencyType {
  /** Spirit Stones - primary income, resets on Ascension */
  SpiritStones = 'spiritStones',
  /** Heavenly Dao Points - earned via Ascension, persists */
  HDP = 'hdp',
  /** Dao Crystals - premium/IAP currency, persists */
  DaoCrystals = 'daoCrystals',
  /** Heavenly Seals - converted from DC, used for Mandates, persists */
  HeavenlySeals = 'heavenlySeals',
  /** Alchemy Essence - from Hall 3 + Hall 5, resets on Ascension */
  AlchemyEssence = 'alchemyEssence',
  /** Recruitment Tokens - from Secret Realms/dailies, persists */
  RecruitmentTokens = 'recruitmentTokens',
  /** Qi Residue - from Common/Uncommon disciple death, persists */
  QiResidue = 'qiResidue',
}

/** Container for all player currencies */
export interface Currencies {
  /** Spirit Stones (resets on Ascension) */
  spiritStones: Decimal;
  /** Heavenly Dao Points (persists) */
  hdp: number;
  /** Dao Crystals (premium, persists) */
  daoCrystals: number;
  /** Heavenly Seals (persists) */
  heavenlySeals: number;
  /** Alchemy Essence (resets on Ascension) */
  alchemyEssence: Decimal;
  /** Recruitment Tokens (persists) */
  recruitmentTokens: number;
  /** Qi Residue (persists) */
  qiResidue: number;
}
