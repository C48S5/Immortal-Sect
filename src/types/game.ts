/** Core game types for Immortal Sect - Cultivation Sect Tycoon */

export interface Disciple {
  id: string;
  name: string;
  realm: CultivationRealm;
  qi: number;
  maxQi: number;
  talent: number;
  loyalty: number;
  traits: string[];
  assignedTask?: string;
}

export enum CultivationRealm {
  MortalBody = 'Mortal Body',
  QiCondensation = 'Qi Condensation',
  FoundationEstablishment = 'Foundation Establishment',
  CoreFormation = 'Core Formation',
  NascentSoul = 'Nascent Soul',
  SpiritSevering = 'Spirit Severing',
  DaoSeeking = 'Dao Seeking',
  Immortal = 'Immortal',
}

export interface Sect {
  name: string;
  reputation: number;
  spiritStones: number;
  disciples: Disciple[];
  buildings: Building[];
  techniques: Technique[];
}

export interface Building {
  id: string;
  name: string;
  type: BuildingType;
  level: number;
  capacity: number;
}

export enum BuildingType {
  CultivationHall = 'Cultivation Hall',
  AlchemyPavilion = 'Alchemy Pavilion',
  WeaponForge = 'Weapon Forge',
  LibraryPavilion = 'Library Pavilion',
  SpiritGarden = 'Spirit Garden',
  DefenseFormation = 'Defense Formation',
  MeditationChamber = 'Meditation Chamber',
}

export interface Technique {
  id: string;
  name: string;
  element: Element;
  rank: TechniqueRank;
  description: string;
}

export enum Element {
  Fire = 'Fire',
  Water = 'Water',
  Earth = 'Earth',
  Wood = 'Wood',
  Metal = 'Metal',
  Lightning = 'Lightning',
  Ice = 'Ice',
  Wind = 'Wind',
}

export enum TechniqueRank {
  Mortal = 'Mortal',
  Yellow = 'Yellow',
  Profound = 'Profound',
  Earth = 'Earth',
  Heaven = 'Heaven',
  Saint = 'Saint',
  Divine = 'Divine',
}

export interface GameState {
  sect: Sect;
  turn: number;
  season: Season;
  year: number;
  events: GameEvent[];
}

export enum Season {
  Spring = 'Spring',
  Summer = 'Summer',
  Autumn = 'Autumn',
  Winter = 'Winter',
}

export interface GameEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  turn: number;
  choices?: EventChoice[];
}

export interface EventChoice {
  label: string;
  effects: Record<string, number>;
}
