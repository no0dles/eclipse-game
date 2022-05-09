import {GameEvent, GamePlayer, PlayerExploreActionEvent, PlayerPlaceTileEvent} from './events';
import {
  Coordinate,
  GameBoard,
  GameMap,
  GameMapTile, GameTile, GameTileSector,
  Player,
  PopulationType,
  TechTile,
  TechTileType,
  TechTray, TileBorder,
} from './datamodel';
import {galacticCenterTile, gameMapTileBorders, guardianBlueprint, influenceTrack, techTrack} from './defaults';
import {species, technologyTiles} from './config';

export interface Game {
  events: GameEvent[];
  board: GameBoard;
  tiles: GameTile[];
  currentPlayerIndex: number;
}

const playerColors = [
  0xFF0000,
  0x00FF00,
]
const populationCount = 12;
const productionScale = [2, 3, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28];
const startingCoordinates = {
  north: {x: 2, y: -2},
  northEast: {x: 0, y: 4},
  northWest: {x: -2, y: -2},
  south: {x: -2, y: 2},
  southWest: {x: 0, y: -4},
  southEast: {x: 2, y: 2},
};

function getProductionValue(map: GameMap, playerId: string, type: PopulationType): number {
  return 0;
}

function getPlayerStartingPositions(playerCount: number): Coordinate[] {
  switch (playerCount) {
    case 2:
      return [startingCoordinates.north, startingCoordinates.south];
    case 3:
      return [startingCoordinates.north, startingCoordinates.southWest, startingCoordinates.southEast];
    case 4:
      return [startingCoordinates.north, startingCoordinates.northWest, startingCoordinates.southEast, startingCoordinates.south];
    case 5:
      return [startingCoordinates.north, startingCoordinates.northEast, startingCoordinates.northWest, startingCoordinates.southEast, startingCoordinates.southWest];
    case 6:
      return [
        startingCoordinates.north,
        startingCoordinates.northWest,
        startingCoordinates.northEast,
        startingCoordinates.south,
        startingCoordinates.southEast,
        startingCoordinates.southWest,
      ]
  }

  throw new Error(`invalid player count ${playerCount}`);
}

function getAlienStartingPositions(playerCount: number): Coordinate[] {
  switch (playerCount) {
    case 2:
      return [startingCoordinates.northWest, startingCoordinates.northEast, startingCoordinates.southWest, startingCoordinates.southEast];
    case 3:
      return [startingCoordinates.northEast, startingCoordinates.northWest, startingCoordinates.south];
    case 4:
      return [startingCoordinates.northEast, startingCoordinates.southWest];
    case 5:
      return [startingCoordinates.south];
    case 6:
      return [
      ]
  }

  throw new Error(`invalid player count ${playerCount}`);
}

function fillTechTray(playerCount: number, currentTechTiles: TechTile[]): TechTray {
  const newCount = getNewTechTileCount(playerCount)
  const techKey = Object.keys(technologyTiles)
  const tiles = [...currentTechTiles]
  for (let i = 0; i < newCount; i++) {
    tiles.push(technologyTiles[techKey[Math.floor(Math.random()*techKey.length)]]);
  }
  return {
    tiles,
    militaryTiles: filterTechTile(tiles, 'military'),
    gridTiles: filterTechTile(tiles, 'grid'),
    rareTiles: filterTechTile(tiles, 'rare'),
    nanoTiles: filterTechTile(tiles, 'nano'),
  }
}

function filterTechTile(tiles: TechTile[], type: TechTileType): TechTile[] {
  return tiles.filter(t => t.type === type).sort((first, second) => {
    return first.costs.default - second.costs.default;
  })
}

function getNewTechTileCount(playerCount: number): number {
  return playerCount + 3;
}

export function getOuterSectorCount(playerCount: number): number {
  switch (playerCount) {
    case 2:
      return 5;
    case 3:
      return 8;
    case 4:
      return 14;
    case 5:
      return 16;
    case 6:
      return 18;
  }
}

export function getGameTiles(playerCount: number): GameTile[] {
  return [
    ...[ ...Array(6).keys() ].map<GameTile>((index) => ({
      sector: 'inner',
      sectorNumber: 1 + index,
      populations: [],
      alienBlueprint: null,
      rewardTile: {victoryPoint: 2,}
    })),
    ...[ ...Array(6).keys() ].map<GameTile>((index) => ({
      sector: 'middle',
      sectorNumber: 10 + index,
      populations: [],
      alienBlueprint: null,
      rewardTile: {victoryPoint: 2,}
    })),
    ...[ ...Array(getOuterSectorCount(playerCount)).keys() ].map<GameTile>((index) => ({
      sector: 'outer',
      sectorNumber: 100 + index,
      populations: [],
      alienBlueprint: null,
      rewardTile: {victoryPoint: 2,}
    }))
  ]
}

export function startGame(gamePlayers: GamePlayer[]): Game {
  const startingPlayerPosition = getPlayerStartingPositions(gamePlayers.length);
  const startingAlienPosition = getAlienStartingPositions(gamePlayers.length);
  const centerTile = galacticCenterTile();

  const players = gamePlayers.map((gamePlayer, index) => {
    const player: Player = {
      id: gamePlayer.id,
      color: playerColors[index],
      speciesBoard: species.erdaniEmpire,
      techTrack: techTrack(),
      influenceTrack: [],
      speciesTray: {
        cruiserCount: 4,
        dreadnoughtCount: 2,
        interceptorCount: 8,
        starbaseCount: 4,
      },
      actions: [...species.erdaniEmpire.actionTrack],
      storages: species.erdaniEmpire.startingSetup.storage.map(storage => {
        return {
          storageValue: storage.value,
          type: storage.type,
          productionValue: getProductionValue(null, gamePlayer.id, storage.type),
        };
      }),
    };
    player.influenceTrack = influenceTrack(player);
    return player;
  });

  return {
    events: [],
    currentPlayerIndex: 0,
    tiles: getGameTiles(players.length),
    board: {
      players,
      map: {
        tiles: [
          {
            tile: centerTile,
            borders: gameMapTileBorders({}),
            influence: null,
            coordinate: {x: 0, y: 0},
            objects: [
              {type: 'alien', blueprint: centerTile.alienBlueprint}
            ],
          },
          ...startingAlienPosition.map<GameMapTile>(coordinate => ({
            tile: {
              rewardTile: {victoryPoint: 2},
              alienBlueprint: guardianBlueprint(),
              populations: [],
              sectorNumber: 0,
              sector: 'middle',
            },
            objects: [{
              type: 'alien',
              blueprint: guardianBlueprint(),
            }],
            borders: gameMapTileBorders({}),
            coordinate,
            influence: null,
          })),
          ...players.map<GameMapTile>((player, index) => {
            const position = startingPlayerPosition[index];
            return {
              tile: {
                rewardTile: {victoryPoint: 3},
                alienBlueprint: null,
                sector: 'middle',
                sectorNumber: species.erdaniEmpire.startingSetup.tile.sectorNumber,
                populations: species.erdaniEmpire.startingSetup.tile.populations,
              },
              objects: species.erdaniEmpire.startingSetup.objects,
              influence: {player},
              borders: gameMapTileBorders({

              }),
              coordinate: position,
            }
          }),
        ],
      },
      techTray: fillTechTray(gamePlayers.length, []),
    },
  };
}

export function getPossibleExploreCoordinates(game: Game, player: Player): Coordinate[] {
  const playerTiles = game.board.map.tiles
    .filter(t => t.influence?.player.id === player.id)
  const coordinates: Coordinate[] = [];

  // TODO check for available tiles in outer sector

  for (const playerTile of playerTiles) {
    for(const border of playerTile.borders) {
      if (!border.wormhole || !!border.neighbor) {
        continue;
      }

      coordinates.push(getNeighboorPosition(playerTile.coordinate, border.type));
    }
  }

  return coordinates
}

export function getNeighboorPosition(coordinate: Coordinate, border: TileBorder): Coordinate {
  if (border === 'north') {
    return {
      x: coordinate.x,
      y: coordinate.y + 2,
    }
  } else if (border === 'south') {
    return {
      x: coordinate.x,
      y: coordinate.y - 2,
    }
  } else if (border === 'north-east') {
    return {
      x: coordinate.x + 1,
      y: coordinate.y + 1,
    }
  } else if (border === 'north-west') {
    return {
      x: coordinate.x - 1,
      y: coordinate.y + 1,
    }
  } else if (border === 'south-east') {
    return {
      x: coordinate.x + 1,
      y: coordinate.y - 1,
    }
  } else if (border === 'south-west') {
    return {
      x: coordinate.x - 1,
      y: coordinate.y - 1,
    }
  }
}

export function getSectorForCoordinate(coordinate: Coordinate): GameTileSector {
  const absoluteX = Math.abs(coordinate.x);
  const absoluteY = Math.abs(coordinate.y)
  if (absoluteX === 1 && absoluteY === 1) {
    return 'inner';
  } else if(absoluteX === 2 && absoluteY === 2) {
    return 'middle'
  } else {
    return 'outer';
  }
}

export function triggerTilePick(game: Game, event: PlayerPlaceTileEvent): Game {
  const currentPlayer = game.board.players[game.currentPlayerIndex];
  if (currentPlayer.id !== event.playerId) {
    throw new Error('not players turn');
  }

  const newGameTile: GameMapTile = {
    tile: event.tile,
    influence: null,
    coordinate: event.coordinate,
    objects: event.tile.alienBlueprint ? [{
      type: 'alien',
      blueprint: event.tile.alienBlueprint,
    }] : [],
    borders: gameMapTileBorders({}),
  };

  if (event.influence) {
    const nextInfluence = currentPlayer.influenceTrack.find(t => !!t.influence);
    newGameTile.influence = nextInfluence.influence;
    nextInfluence.influence = null;
  }

  game.currentPlayerIndex++;

  return {
    tiles: game.tiles,
    currentPlayerIndex: game.currentPlayerIndex % game.board.players.length,
    board: {
      ...game.board,
      map: {
        tiles: [
          ...game.board.map.tiles.map(tile => {
            return tile;
          }),
          newGameTile,
        ]
      }
    },
    events: [
      ...game.events,
      event,
    ],
  }
}

export function triggerExploreAction(game: Game, event: PlayerExploreActionEvent): { game: Game, tile: GameTile } {
  const currentPlayer = game.board.players[game.currentPlayerIndex];
  if (currentPlayer.id !== event.playerId) {
    throw new Error('not players turn');
  }

  const sector = getSectorForCoordinate(event.coordinate);
  const tiles = game.tiles.filter(t => t.sector === sector);
  const tileIndex = Math.floor(Math.random()*tiles.length);
  const newTile = tiles[tileIndex]
  console.log(newTile, sector, game.tiles)
  return {
    game: {
      currentPlayerIndex: game.currentPlayerIndex,
      board: game.board,
      events: [...game.events, event, {
        type: 'game-tile-draw',
        playerId: event.playerId,
        tile: newTile,
      }],
      tiles: game.tiles.filter(t => t !== newTile),
    },
    tile: newTile,
  }
}
