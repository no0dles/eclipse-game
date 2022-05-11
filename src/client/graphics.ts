import {Coordinate, GameMapTile, Player, PlayerAction, Storage, TechTile, TechTray} from '../datamodel';
import {Container, Graphics, InteractionEvent, Sprite, Text, TextStyle} from 'pixi.js';
import {Game, getPossibleExploreCoordinates, triggerExploreAction} from '../game';

const hexagonRadius = 60;
const portalRadius = 10;
const hexagonHeight = hexagonRadius * Math.sqrt(3);

export function renderHexagon(coordinate: Coordinate) {
  const hexagon = new Graphics();

  hexagon.beginFill(0xcccccc);
  hexagon.lineStyle(2, 0xFFFFFF);
  hexagon.drawPolygon([
    -hexagonRadius, 0,
    -hexagonRadius / 2, hexagonHeight / 2,
    hexagonRadius / 2, hexagonHeight / 2,
    hexagonRadius, 0,
    hexagonRadius / 2, -hexagonHeight / 2,
    -hexagonRadius / 2, -hexagonHeight / 2,
  ]);

  hexagon.endFill();
  hexagon.x = hexagonRadius * coordinate.x * 1.5;
  hexagon.y = hexagonHeight / 2 * coordinate.y;

  const lblStyle = new TextStyle({
    fontSize: 12,
    fill: '#333',
  });
  const lbl = new Text(`${coordinate.x}/${coordinate.y}`, lblStyle);
  lbl.x = lbl.width / 2 * -1;
  lbl.y = lbl.height / 2 * -1 + 20;
  hexagon.addChild(lbl);

  return hexagon
}

export function renderTile(players: Player[],tile: GameMapTile) {
  const hexagon = renderHexagon(tile.coordinate);

  for(const border of tile.borders) {
    const northPortal = new Graphics();
    northPortal.beginFill(0xFFFFFF);

    if(border.type === 'north-west') {
      northPortal.angle = 60;
    } else if(border.type === 'north-east') {
      northPortal.angle = -60;
    } else if(border.type === 'south') {
      northPortal.angle = 180;
    } else if(border.type === 'south-west') {
      northPortal.angle = 240;
    } else if(border.type === 'south-east') {
      northPortal.angle = 120;
    } else if(border.type === 'north') {
      northPortal.beginFill(0xeeeeee);
    }
    northPortal.arc(0, -hexagonHeight / 2, portalRadius, 0, Math.PI);
    hexagon.addChild(northPortal);
  }

  const center = new Graphics();

  if (tile.influence) {
    const player = players.find(p => p.id === tile.influence.playerId);
    center.beginFill(player.color);
  } else {
    center.lineStyle(2, 0xFFFFFF);
  }
  center.drawCircle(0, 0, 10);
  center.endFill();
  hexagon.addChild(center);

  return hexagon;
}

export function renderStorage(storage: Storage): Container {
  const container = new Container();

  const icon = Sprite.from(`assets/${storage.type}.svg`);
  icon.width = 20;
  icon.height = 20;

  const titleStyle = new TextStyle({
    //fontFamily: 'Arial',
    fontSize: 18,
    fill: '#333',
  });
  const lbl = new Text(storage.storageValue.toString(), titleStyle)
  lbl.x = 30;

  container.addChild(icon)
  container.addChild(lbl)

  return container;
}

export function renderActionControls(player: Player, callback: (action: PlayerAction) => void) {
  const container = new Container();

  let i = 0;
  for (const action of player.actions) {
    const btn = new Graphics();
    btn.beginFill(0xFFFFFF);
    btn.drawCircle(0, 0, 20);
    btn.endFill();
    btn.interactive = true;
    btn.buttonMode = true;
    btn.x = i++ * 50 + 40;

    const stripe = Sprite.from(`assets/${action.type}.svg`);
    stripe.x = -10;
    stripe.y = -10;
    stripe.width = 20;
    stripe.height = 20;
    btn.addChild(stripe);
    btn.on('pointerdown', evt => {
      callback(action)
    });

    container.addChild(btn);
  }

  return container;
}

export function showExploreOptions(game: Game, player: Player, callback: (coordinate: Coordinate) => void): Container {
  const coordinates = getPossibleExploreCoordinates(game, player);

  const container = new Container();

  for (const coordinate of coordinates) {
    const newTile = renderHexagon(coordinate)
    newTile.alpha = 0.5;
    newTile.interactive = true;
    newTile.buttonMode = true;
    newTile.on('pointerdown', evt => {
      callback(coordinate)
    })
    newTile.on('pointerover', evt => {
      newTile.alpha = 0.8;
    })
    newTile.on('pointerout', evt => {
      newTile.alpha = 0.5;
    })
    container.addChild(newTile);
  }

  return container;
}


export function renderTechRow(techTiles: TechTile[], title: string, y: number, callback: (tile: TechTile) => void): Container {
  const container = new Container();
  const titleStyle = new TextStyle({
    //fontFamily: 'Arial',
    fontSize: 10,
    fill: '#333',
  });
  const titleLabel = new Text(title, titleStyle);

  container.addChild(titleLabel);

  let i = 0;
  for (const tile of techTiles) {

    const tileFrame = new Graphics();
    tileFrame.lineStyle(2, 0x666666)
    tileFrame.beginFill(0x777777)
    tileFrame.drawRect(0, 15, 40, 40)
    tileFrame.endFill()
    tileFrame.interactive = true;
    tileFrame.buttonMode = true;
    tileFrame.on('pointerdown', (evt: InteractionEvent) => {
      evt.stopPropagation();
      callback(tile);
    })

    const cost = new Graphics()
    cost.beginFill(0xFFFF00)
    cost.drawCircle(0, 0, 10);
    cost.x = 40
    cost.y = 10
    cost.endFill()

    const costTitle = new Text(`${tile.costs.default}/${tile.costs.minimum}`);
    costTitle.height = 15 / costTitle.width * costTitle.height;
    costTitle.width = 15;
    costTitle.x = costTitle.width / 2 * -1;
    costTitle.y = costTitle.height / 2 * -1;
    cost.addChild(costTitle);

    tileFrame.addChild(cost)

    const lblStyle = new TextStyle({
      //fontFamily: 'Arial',
      fontSize: 12,
      fill: '#333',
    });
    const tileLabel = new Text(tile.name, lblStyle);
    //tileLabel.height = 40 / tileLabel.width * tileLabel.height
    tileLabel.width = 36;
    tileLabel.y = 40;
    tileLabel.x = 2
    tileFrame.addChild(tileLabel);
    tileFrame.x = i++ * 50;

    container.addChild(tileFrame);
  }

  container.y = y;
  container.x = 40
  return container;
}

export function renderStats(player: Player): Container {
  const container = new Container();

  let i = 0;
  for (const storage of player.storages) {
    const subContainer = renderStorage(storage);
    subContainer.x = i++ * 60;
    container.addChild(subContainer);
  }

  return container;
}

export function showTechTray(window: {width: number; height: number}, techTray: TechTray, callback: (tile: TechTile | null) => void): Container {
  const container = new Container();

  const background = new Graphics();
  background.beginFill(0x000000, 0.3);
  background.drawRect(0, 0, window.width, window.height);
  background.endFill();
  background.interactive = true;
  background.buttonMode = true;
  background.zIndex = 0;
  background.on('pointerdown', evt => {
    callback(null);
  });

  container.addChild(background);

  const frame = new Graphics();
  frame.interactive = false;
  frame.beginFill(0xcccccc);
  frame.drawRect(0, 0, window.width - 80, window.height - 80);
  frame.x = 40;
  frame.y = 40;
  frame.endFill();
  frame.zIndex = 10;

  container.addChild(frame);

  frame.addChild(renderTechRow(techTray.militaryTiles, 'Military', 20, callback));
  frame.addChild(renderTechRow(techTray.gridTiles, 'Grid', 80, callback));
  frame.addChild(renderTechRow(techTray.nanoTiles,'Nano', 160, callback));
  frame.addChild(renderTechRow(techTray.rareTiles, 'Rare', 220, callback));

  return container;
}
