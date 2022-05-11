export interface GameBoard {
  players: Player[];
  techTray: TechTray;
  map: GameMap;
}

export interface GameMap {
  tiles: GameMapTile[];
}

export interface GameTileBorder {
  neighbor: GameMapTile | null;
  wormhole: boolean;
  type: TileBorder;
}

export type PopulationType = 'money' | 'science' | 'material'

export interface GameTilePopulation {
  type: PopulationType;
  advanced: boolean;
  activated: boolean;
}

export type TileBorder = 'north' | 'north-west' | 'north-east' | 'south' | 'south-west' | 'south-east';

export interface Coordinate {
  x: number;
  y: number;
}

export interface GameMapTile {
  coordinate: Coordinate;
  borders: GameTileBorder[];
  influence: PlayerInfluence | null;
  objects: TileObject[];
  tile: GameTile;
}

export type TileObject = TileShipObject | TileMonolithObject | TileOrbitalObject | TileAlienObject

export interface TileAlienObject {
  type: 'alien';
  blueprint: AlienBlueprint;
}

export interface TileShipObject {
  ship: ShipType,
  type: 'ship'
  playerId: string
}

export interface TileMonolithObject {
  type: 'monolith';
}

export interface TileOrbitalObject {
  type: 'orbital';
  population: PopulationType;
}

export interface GameTile {
  populations: GameTilePopulation[];
  sectorNumber: number;
  sector: GameTileSector;
  rewardTile: ReputationTile | null;
  alienBlueprint: AlienBlueprint | null;
}

export type GameTileSector = 'inner' | 'middle' | 'outer';

export interface TechTray {
  tiles: TechTile[];

  militaryTiles: TechTile[]
  gridTiles: TechTile[];
  nanoTiles: TechTile[];
  rareTiles: TechTile[];
}

export interface Player {
  id: string
  storages: Storage[];
  speciesTray: SpeciesTray;
  speciesBoard: SpeciesBoard;
  influenceTrack: InfluenceTrack[];
  actions: PlayerAction[];
  techTrack: TechTrack;
  color: number;
}

export interface PlayerAction {
  type: ActionType;
  count: number;
}

export interface ReputationTrack {
  possibleTiles: 'ambassador' | 'reputation' | 'both';
  tile: AmbassadorTile | ReputationTile | null;
}

export interface TechTrack {
  military: TechTile[];
  grid: TechTile[];
  nano: TechTile[];
}

export type TechTileType = 'military' | 'grid' | 'nano' | 'rare';

export interface TechTile {
  type: TechTileType;
  name: string;
  shipPartTile: ShipPartTile | null;
  costs: { default: number, minimum: number };
}

export interface AmbassadorTile {

}

export interface ReputationTile {
  victoryPoint: number;
}

export type AlienType = 'ancient' | 'guardian' | 'gcds';

export interface AlienBlueprint {
  alienType: AlienType
  initiativeBonus: number;
  stats: ShipPart
}

export interface ShipBlueprint {
  buildCost: number;
  shipType: ShipType;

  baseInitiativeBonus: number;
  baseShip: ShipPart;

  upgrades: ShipPartTile[];
}

export interface Blueprint {
  buildCost: number;
  shipType: ShipType | AlienType;
  //shipName: string
  initiativeBonus: number;

  parts: ShipPartTile[];
  extra: ShipPart;
}


export interface ShipPart {
  requiredEnergy: number;
  energySource: number;
  initiative: number;
  drive: number;
  hull: number;
  computer: number;
  weaponCount: number;
  weaponHits: number;
  missileCount: number;
  missileHits: number;
  shield: number;
}

export interface ShipPartTile {
  type: ShipPartTileType;
  name: string;
  part: ShipPart;
}

export type ShipType = 'interceptor' | 'cruiser' | 'dreadnought' | 'starbase';
export type ShipPartTileType = 'weapon' | 'computer' | 'shield' | 'hull' | 'drive' | 'energy-source';


export interface ColonyShip {
  swapped: boolean;
}

export interface PlayerInfluence {
  playerId: string;
}

export interface SpeciesTray {
  dreadnoughtCount: number;
  starbaseCount: number;
  interceptorCount: number;
  cruiserCount: number;
}

export interface SpeciesBoard {
  name: string;
  colonyShips: ColonyShip[];
  startingSetup: {
    tile: SpeciesTile
    storage: {
      value: number
      type: PopulationType
    }[]
    objects: TileObject[]
    startingTech: TechTile[];
    influenceDiscs: number
  };

  tradeValue: number;

  reputationTrack: ReputationTrack[];
  actionTrack: PlayerAction[];

  blueprints: ShipBlueprint[];
}

export interface SpeciesTile {
  sectorNumber: number;
  populations: GameTilePopulation[];
}

export type ActionType = 'explore' | 'research' | 'upgrade' | 'build' | 'move' | 'influence';

export type Species =
  'eridani-empire'
  | 'hydran-progress'
  | 'planta'
  | 'descendants-of-draco'
  | 'mechanema'
  | 'orion-hegemony'
  | 'terran-directorate'
  | 'terran-federation'
  | 'terran-union'
  | 'terran-republic'
  | 'terran-conglomerate'
  | 'terran-alliance'

export interface InfluenceTrack {
  influence: PlayerInfluence | null;
  moneyCost: number;
}

export interface Storage {
  storageValue: number;
  productionValue: number;
  type: PopulationType
}
