import {
  Blueprint, Coordinate,
  GameMapTile,
  GameTile,
  GameTileSector, PopulationType,
  ShipType,
  Species,
  TechTile,
  TileBorder, TileShipObject,
} from './datamodel';

export interface GameSetupEvent {
  type: 'game-setup';
  players: GamePlayer[];
}

export interface GamePlayer {
  id: string
  species: Species
}

///////////////////////////////////////////
export interface PlayerExploreActionEvent {
  type: 'player-explore-action';
  playerId: string;
  coordinate: Coordinate;
}

export interface GameTileDrawEvent {
  type: 'game-tile-draw';
  playerId: string;
  tile: GameTile;
}

export interface PlayerFoldTileEvent {
  type: 'player-fold-tile';
  playerId: string;
}

export interface PlayerPlaceTileEvent {
  type: 'player-place-tile';
  playerId: string;
  coordinate: Coordinate;
  tile: GameTile;
  rotation: number;
  influence: boolean;
}


///////////////////////////////////////////
export interface PlayerResearchActionEvent {
  type: 'player-research-action';
  playerId: string;
  tech: TechTile;
}

export interface PlayerUpgradeActionEvent {
  type: 'player-upgrade-action';
  playerId: string;
  blueprints: { blueprint: Blueprint, shipParts: Blueprint[] };
}

export interface PlayerBuildActionEvent {
  type: 'player-build-action';
  playerId: string;
  objects: BuildObject[];
}

export interface ShipBuildObject {
  ship: ShipType,
  type: 'ship'
}

export interface BuildMonolith {
  type: 'monolith';
  tile: GameMapTile;
}

export interface BuildOrbital {
  type: 'orbital';
  tile: GameMapTile;
  population: PopulationType;
}

export interface BuildStarbase {
  type: 'starbase';
  tile: GameMapTile;
}

export type BuildObject = ShipBuildObject | BuildMonolith | BuildOrbital | BuildStarbase

export interface PlayerMoveActionEvent {
  type: 'player-move-action';
  playerId: string;
  moves: {
    ships: TileShipObject[]
    from: GameMapTile
    to: GameMapTile
  }[];
}

export interface PlayerInfluenceActionEvent {
  type: 'player-influence-action';
  playerId: string;
  moves: {
    from: GameMapTile | null
    to: GameMapTile
  }[];
}

export interface PlayerRoundPassEvent {
  type: 'player-round-pass';
  playerId: string;
}

export interface GamePlayerTurnEvent {
  type: 'game-player-turn';
  playerId: string;
}

export interface GameRoundActionEvent {
  type: 'game-round-action';
  startingPlayerId: string;
}

export interface GameRoundCombatEvent {
  type: 'game-round-cleanup';
  round: number;
}

export interface GameRoundUpkeepEvent {
  type: 'game-round-upkeep';
}

export interface GameRoundCleanupEvent {
  type: 'game-round-cleanup';
  round: number;
}

export type GameEvent =
  GameSetupEvent
  | PlayerExploreActionEvent
  | GameTileDrawEvent
  | PlayerFoldTileEvent
  | PlayerPlaceTileEvent
  | PlayerResearchActionEvent
  | PlayerUpgradeActionEvent
  | PlayerBuildActionEvent
  | PlayerMoveActionEvent
  | PlayerInfluenceActionEvent
  | PlayerRoundPassEvent
  | GamePlayerTurnEvent
  | GameRoundActionEvent
  | GameRoundCombatEvent
  | GameRoundUpkeepEvent
  | GameRoundCleanupEvent;
