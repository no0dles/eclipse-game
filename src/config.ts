import {
  actionTrack,
  colonyShips, cruiserBlueprint,
  dreadnoughtBlueprint,
  interceptorBlueprint,
  shipPart, shipPartTile, speciesBoard,
  starbaseBlueprint, techTile,
} from './defaults';

const shipPartTiles = {
  gluonComputer: shipPartTile({
    type: 'computer',
    name: 'Gluon Computer',
    part: shipPart({
      computer: 3,
    })
  }),
}

export const technologyTiles = {
  neutronBombs: techTile({
    type: 'military',
    name: 'Neutron Bombs',
    costs: {default: 2, minimum: 2},
  }),
  starbase: techTile({
    type: 'military',
    name: 'Starbase',
    costs: {default: 4, minimum: 3},
  }),
  plasmaCannon: techTile({
    type: 'military',
    name: 'Plasma Cannon',
    costs: {default: 6, minimum: 4},
  }),
  phaseShield: techTile({
    type: 'military',
    name: 'Phase Shield',
    costs: {default: 8, minimum: 5},
  }),
  advancedMining: techTile({
    type: 'military',
    name: 'Advanced Mining',
    costs: {default: 10, minimum: 6},
  }),
  tachyonSource: techTile({
    type: 'military',
    name: 'Tachyon Source',
    costs: {default: 12, minimum: 6},
  }),
  gluonComputer: techTile({
    type: 'military',
    name: 'Gluon Computer',
    shipPartTile: shipPartTiles.gluonComputer,
    costs: {default: 14, minimum: 7},
  }),
  plasmaMissile: techTile({
    type: 'military',
    name: 'Plasma Missile',
    costs: {default: 16, minimum: 8},
  }),
  gaussShield: techTile({
    type: 'grid',
    name: 'Gauss Shield',
    costs: {default: 2, minimum: 2},
  }),
  fusionSource: techTile({
    type: 'grid',
    name: 'Fusion Source',
    costs: {default: 4, minimum: 3},
  }),
  improvedHull: techTile({
    type: 'grid',
    name: 'Improved Hull',
    costs: {default: 6, minimum: 4},
  }),
  positronComputer: techTile({
    type: 'grid',
    name: 'Positron Computer',
    costs: {default: 8, minimum: 5},
  }),
  advancedEconomy: techTile({
    type: 'grid',
    name: 'Advanced Economy',
    costs: {default: 10, minimum: 6},
  }),
  tachyonDrive: techTile({
    type: 'grid',
    name: 'Tachyon Drive',
    costs: {default: 12, minimum: 6},
  }),
  antimatterCannon: techTile({
    type: 'grid',
    name: 'Antimatter Cannon',
    costs: {default: 14, minimum: 7},
  }),
  quantumGrid: techTile({
    type: 'grid',
    name: 'Quantum grid',
    costs: {default: 16, minimum: 8},
  }),
};

export const species = {
  erdaniEmpire: speciesBoard({
    name: 'Erdani Empire',
    actionTrack: actionTrack({
      explore: 1,
      research: 1,
      upgrade: 2,
      build: 2,
      move: 2,
      influence: 2,
    }),
    startingSetup: {
      tile: {
        sectorNumber: 222,
        populations: [{
          activated: true,
          advanced: false,
          type: 'science',
        }, {
          activated: false,
          advanced: true,
          type: 'science',
        }, {
          activated: true,
          advanced: false,
          type: 'money',
        }, {
          activated: false,
          advanced: true,
          type: 'money',
        }],
      },
      storage: [{type: 'material', value: 4}, {type: 'science', value: 2}, {type: 'money', value: 26}],
      influenceDiscs: 10,
      objects: [{type: 'ship', ship: 'interceptor', playerId: ''}],
      startingTech: [
        technologyTiles.gaussShield,
        //technologyTiles.fusionDrive,
        technologyTiles.plasmaCannon,
      ],
    },
    reputationTrack: [
      {tile: null, possibleTiles: 'both'},
      {tile: null, possibleTiles: 'both'},
      {tile: null, possibleTiles: 'both'},
      {tile: null, possibleTiles: 'both'},
    ],
    tradeValue: 3,
    blueprints: [
      interceptorBlueprint({
        baseShip: shipPart({energySource: 1}),
      }),
      cruiserBlueprint({
        baseShip: shipPart({energySource: 1}),
      }),
      dreadnoughtBlueprint({
        baseShip: shipPart({energySource: 1}),
      }),
      starbaseBlueprint({})
    ],
    colonyShips: colonyShips(3),
  }),
}
