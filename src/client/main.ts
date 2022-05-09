import './style.css';

import {Application, Container} from 'pixi.js';
import {startGame, triggerExploreAction, triggerTilePick} from '../game';
import {
  GameMap,
  Player,
} from '../datamodel';
import {renderActionControls, renderStats, renderTile, showExploreOptions, showTechTray} from './graphics';

let width = window.innerWidth;
let height = window.innerHeight;
let game = startGame([{
  id: 'a',
  species: 'eridani-empire',
}, {
  id: 'b',
  species: 'eridani-empire',
}]);

const app = new Application({
  width,
  height,
  backgroundColor: 0x1099bb,
  //resolution: window.devicePixelRatio || 1,
});

document.body.appendChild(app.view);

window.onresize = evt => {
  width = window.innerWidth;
  height = window.innerHeight;

  updateMap(game.board.map)
  renderStats(currentPlayer())
};

const mapContainer = new Container();
const statsContainer = new Container();

app.stage.addChild(mapContainer);
app.stage.addChild(statsContainer)

// // Add a ticker callback to move the sprite back and forth
// let elapsed = 0.0;
// app.ticker.add((delta) => {
//   elapsed += delta;
//   //sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
// });

function updateMap(gameMap: GameMap) {
  mapContainer.removeChildren();

  for (const tile of gameMap.tiles) {
    const container = renderTile(tile);
    mapContainer.addChild(container);
  }
}

const actionControlContainer = renderActionControls(currentPlayer(), action => {
  if (action.type === 'research') {
    const techContainer =  showTechTray({width, height}, game.board.techTray, (tile) => {
      app.stage.removeChild(techContainer);
    });
    app.stage.addChild(techContainer);
  } else if(action.type === 'explore') {
    const exploreContainer = showExploreOptions(game, currentPlayer(), coordinate => {
      mapContainer.removeChild(exploreContainer);

      console.log('select tile', coordinate)
      const result = triggerExploreAction(game, {
        coordinate,
        type: 'player-explore-action',
        playerId: currentPlayer().id,
      })
      game = result.game
      game = triggerTilePick(game, {
        tile: result.tile,
        influence: true,
        coordinate,
        playerId: currentPlayer().id,
        rotation: 0,
        type: 'player-place-tile',
      })
      updateMap(game.board.map)
      renderStats(game.board.players[game.currentPlayerIndex])
    })
    mapContainer.addChild(exploreContainer);
  } else {
    console.log('action', action);
  }
});
actionControlContainer.y = height-actionControlContainer.height;
app.stage.addChild(actionControlContainer);

function currentPlayer(): Player {
  return game.board.players[game.currentPlayerIndex];
}

statsContainer.addChild(renderStats(currentPlayer()))
statsContainer.x = width - statsContainer.width - 10;
statsContainer.y = height - statsContainer.height - 10;

updateMap(game.board.map)

mapContainer.interactive = true;
mapContainer.on('pointerdown', onDragStart)
  .on('pointerup', onDragEnd)
  .on('pointerupoutside', onDragEnd)
  .on('pointermove', onDragMove)

function onDragStart(event) {
  // store a reference to the data
  // the reason for this is because of multitouch
  // we want to track the movement of this particular touch
  //mapContainer.anchor.set(0.5);
  this.data = event.data;
  const newPosition = this.data.getLocalPosition(this);
  this.offset = {x:  newPosition.x, y: newPosition.y}
  //console.log(bounds.x - newPosition.x, bounds.y - newPosition.y)
  //this.alpha = 0.5;
  this.dragging = true;
}

function onDragEnd() {
  //this.alpha = 1;
  this.dragging = false;
  // set the interaction data to null
  this.data = null;
  this.offset = null;
}

function onDragMove() {
  if (this.dragging) {
    const newPosition = this.data.getLocalPosition(this.parent);
    this.x = newPosition.x - this.offset.x;
    this.y = newPosition.y - this.offset.y;
  }
}

mapContainer.x = app.screen.width / 2;
mapContainer.y = app.screen.height / 2;
