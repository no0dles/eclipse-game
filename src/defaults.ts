import {
  AlienBlueprint,
  ColonyShip, GameTile, GameTileBorder,
  InfluenceTrack, Player, PlayerAction, ShipBlueprint,
  ShipPart,
  ShipPartTile, SpeciesBoard,
  TechTile,
  TechTrack,
} from './datamodel';

export function actionTrack(values: {
  explore: number
  research: number
  upgrade: number
  build: number
  move: number
  influence: number
}): PlayerAction[] {
  return [
    {count: values.explore, type: 'explore'},
    {count: values.explore, type: 'research'},
    {count: values.explore, type: 'upgrade'},
    {count: values.explore, type: 'build'},
    {count: values.explore, type: 'move'},
    {count: values.explore, type: 'influence'},
  ];
}

export function colonyShips(count: number): ColonyShip[] {
  return Array(count).fill({swapped: false});
}


export function techTile(value: Omit<TechTile, 'shipPartTile'> | TechTile): TechTile {
  return {
    shipPartTile: null,
    ...value,
  };
}

export function speciesBoard(value: SpeciesBoard): SpeciesBoard {
  return {
    ...value,
  };
}

export function shipPartTile(value: ShipPartTile): ShipPartTile {
  return {
    ...value,
  };
}

export function shipPart(value: Partial<ShipPart>): ShipPart {
  return {
    energySource: 0,
    computer: 0,
    drive: 0,
    hull: 0,
    initiative: 0,
    requiredEnergy: 0,
    shield: 0,
    weaponCount: 0,
    weaponHits: 0,
    missileCount: 0,
    missileHits: 0,
    ...value,
  };
}

export function interceptorBlueprint(blueprint: Partial<ShipBlueprint>): ShipBlueprint {
  return {
    baseShip: shipPart({}),
    buildCost: 3,
    baseInitiativeBonus: 0,
    upgrades: [],
    shipType: 'interceptor',
  };
}

export function cruiserBlueprint(blueprint: Partial<ShipBlueprint>): ShipBlueprint {
  return {
    baseShip: shipPart({}),
    buildCost: 5,
    baseInitiativeBonus: 0,
    upgrades: [],
    shipType: 'cruiser',
  };
}

export function dreadnoughtBlueprint(blueprint: Partial<ShipBlueprint>): ShipBlueprint {
  return {
    baseShip: shipPart({}),
    buildCost: 8,
    baseInitiativeBonus: 0,
    upgrades: [],
    shipType: 'dreadnought',
  };
}

export function starbaseBlueprint(blueprint: Partial<ShipBlueprint>): ShipBlueprint {
  return {
    baseShip: shipPart({}),
    buildCost: 3,
    baseInitiativeBonus: 0,
    upgrades: [],
    shipType: 'starbase',
  };
}

export function influenceTrack(player: Player): InfluenceTrack[] {
  return [
    {influence: null, moneyCost: 0},
    {influence: null, moneyCost: 0},
    {influence: {player}, moneyCost: 1},
    {influence: {player}, moneyCost: 2},
    {influence: {player}, moneyCost: 3},
    {influence: {player}, moneyCost: 5},
    {influence: {player}, moneyCost: 7},
    {influence: {player}, moneyCost: 10},
    {influence: {player}, moneyCost: 13},
    {influence: {player}, moneyCost: 17},
    {influence: {player}, moneyCost: 21},
    {influence: {player}, moneyCost: 25},
    {influence: {player}, moneyCost: 30},
  ];
}

export function guardianBlueprint(): AlienBlueprint {
  return {
    alienType: 'guardian',
    initiativeBonus: 3,
    stats: shipPart({
      hull: 2,
      computer: 2,
      weaponCount: 3,
      weaponHits: 1,
    })
  }
}

export function ancientsBlueprint(): AlienBlueprint {
  return {
    alienType: 'ancient',
    stats: shipPart({
      hull: 1,
      computer: 1,
      weaponCount: 2,
      weaponHits: 1,
    }),
    initiativeBonus: 2,
  }
}

export function galacticCenterBlueprint(): AlienBlueprint {
  return {
    alienType: 'gcds',
    initiativeBonus: 0,
    stats: shipPart({
      hull: 7,
      computer: 2,
      missileHits: 1,
      missileCount: 3,
    })
  }
}

export function galacticCenterTile(): GameTile {
  return {
    sectorNumber: 1,
    sector: 'inner',
    rewardTile: {
      victoryPoint: 4,
    },
    alienBlueprint: galacticCenterBlueprint(),
    populations: [{
      activated: false,
      type: 'money',
      advanced: false,
    }, {
      activated: false,
      type: 'money',
      advanced: false,
    }, {
      activated: false,
      type: 'material',
      advanced: false,
    }, {
      activated: false,
      type: 'material',
      advanced: true,
    }, {
      activated: false,
      type: 'science',
      advanced: false,
    }, {
      activated: false,
      type: 'science',
      advanced: true,
    }],
  };
}

export function gameMapTileBorders(values: Partial<{
  north: boolean
  northEast: boolean
  northWest: boolean
  south: boolean
  southEast: boolean
  southWest: boolean
}>): GameTileBorder[] {
  return [
    {neighbor: null, wormhole: values.north ?? true, type: 'north' },
    {neighbor: null, wormhole: values.northEast ?? true, type: 'north-east' },
    {neighbor: null, wormhole: values.northWest ?? true, type: 'north-west' },
    {neighbor: null, wormhole: values.south ?? true, type: 'south' },
    {neighbor: null, wormhole: values.southEast ?? true, type: 'south-east' },
    {neighbor: null, wormhole: values.southWest ?? true, type: 'south-west' },
  ];
}

export function techTrack(): TechTrack {
  return {
    grid: [],
    military: [],
    nano: [],
  };
}
