import './style.css';

import {Application, Container} from 'pixi.js';
import {Game, triggerExploreAction, triggerTilePick} from '../game';
import {
  Coordinate,
  GameMap, GameTile,
  Player,
} from '../datamodel';
import {renderActionControls, renderStats, renderTile, showExploreOptions, showTechTray} from './graphics';
import {GameEvent} from '../events';

let width = window.innerWidth;
let height = window.innerHeight;
let game: Game | null = null;

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
  console.log('resize ', width, height)
  if (game) {
    render(game);
  }
};

// // Add a ticker callback to move the sprite back and forth
// let elapsed = 0.0;
// app.ticker.add((delta) => {
//   elapsed += delta;
//   //sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
// });

function currentPlayer(): Player {
  return game.board.players.find(p => p.id === playerId);
}

const playerId = makeid(5)
const playerSecret = makeid(10);

const events = new EventSource(`http://localhost:5000?playerId=${playerId}&playerSecret=${playerSecret}`);
events.onmessage = (evt) => {
  game = JSON.parse(evt.data);
  console.log(game);
  render(game);
}

function render(game: Game) {
  const mapContainer = new Container();
  const statsContainer = new Container();

  for (const tile of game.board.map.tiles) {
    const container = renderTile(game.board.players, tile);
    mapContainer.addChild(container);
  }

  renderStats(currentPlayer())

  const actionControlContainer = renderActionControls(currentPlayer(), action => {
    if (action.type === 'research') {
      const techContainer =  showTechTray({width, height}, game.board.techTray, (tile) => {
        app.stage.removeChild(techContainer);
      });
      app.stage.addChild(techContainer);
    } else if(action.type === 'explore') {
      const exploreContainer = showExploreOptions(game, currentPlayer(), coordinate => {
        mapContainer.removeChild(exploreContainer);

        sendEvent<GameTile>({
          coordinate,
          type: 'player-explore-action',
          playerId: playerId,
        }).then(tile => {
          sendEvent({
            type: 'player-place-tile',
            tile,
            playerId,
            coordinate,
            rotation: 0,
            influence: true,
          })
        })
      })
      mapContainer.addChild(exploreContainer);
    } else {
      console.log('action', action);
    }
  });
  actionControlContainer.y = height-actionControlContainer.height;

  statsContainer.x = width - statsContainer.width - 10;
  statsContainer.y = height - statsContainer.height - 10;

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

  statsContainer.addChild(renderStats(currentPlayer()))

  app.stage.removeChildren();
  app.stage.addChild(actionControlContainer);
  app.stage.addChild(mapContainer);
  app.stage.addChild(statsContainer)
}

function sendEvent<T>(event: GameEvent): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `http://localhost:5000?playerId=${playerId}&playerSecret=${playerSecret}`, true);
    xhr.onload = function () {
      if(this.responseText && this.responseText.length > 0) {
        resolve(JSON.parse(this.responseText));
      } else {
        resolve();
      }
    };
    xhr.send(JSON.stringify(event));
  })
}

function makeid(length: number): string {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}
