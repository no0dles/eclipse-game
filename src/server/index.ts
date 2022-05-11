import {createServer, IncomingMessage, ServerResponse} from 'http';
import {Game, startGame, triggerExploreAction, triggerTilePick} from '../game';
import {GameEvent} from '../events';
import {parse} from 'url';

export interface ServerGame {
  game: Game;
  clients: Client[]
}

const port = process.env.PORT ?? 5000;
const queue: Client[] = [];
const games: ServerGame[] = [];
const players: {[key: string]: {playerSecret: string, game: ServerGame} } = {};

interface Client {
  playerId: string;
  playerSecret: string;
  serverGame: ServerGame | null;
  update(game: Game): void;
}

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Cache-Control, Last-Event-ID, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');

  if (req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    res.write('\n');

    const client = createClient(req, res);
    queue.push(client);
    console.log('add player ' + client.playerId)

    if (queue.length >= 2) {
      console.log('start game with players', queue.map(q => q.playerId).join(', '))
      const clients = queue.splice(0, queue.length);
      const newGame: ServerGame = {
        clients,
        game: startGame(clients.map(c => ({
          id: c.playerId,
          species: 'eridani-empire',
        })))
      }
      for (const client of newGame.clients) {
        client.serverGame = newGame;
        players[client.playerId] = {
          playerSecret: client.playerSecret,
          game: newGame,
        }
      }
      games.push(newGame);
      pushUpdate(newGame);
    }

    req.on('close', () => {
      console.log('player closed', client.playerId);
      if (client.serverGame) {
        const index = client.serverGame.clients.indexOf(client)
        client.serverGame.clients.splice(index, 1);
        // update players left, remove game
      }
    });
  } else if (req.method === 'POST') {
    const creds = parseClientAuth(req)
    const player = players[creds.playerId]
    console.log('player sent post action', creds.playerId)
    if (player.playerSecret !== creds.playerSecret) {
      res.writeHead(401);
      res.end();
    } else {
      getPostData<GameEvent>(req).then(data => {
        const result = updateGame(player.game, data);
        if (result) {
          res.writeHead(200);
          res.write(JSON.stringify(result));
          res.end();
        } else {
          res.writeHead(200);
          res.end();
        }
        pushUpdate(player.game);
      });
    }
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
  }
});

function pushUpdate(game: ServerGame) {
  for (const client of game.clients) {
    client.update(game.game);
  }
}

function getPostData<T>(req: IncomingMessage): Promise<T> {
  return new Promise<T>((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(JSON.parse(body));
    });
  })
}

function parseClientAuth(req: IncomingMessage) {
  const queryObject = parse(req.url, true).query;
  const playerId = queryObject.playerId as string;
  const playerSecret = queryObject.playerSecret as string;

  return {
    playerId,
    playerSecret,
  }
}

function createClient(req: IncomingMessage, res: ServerResponse): Client {
  const creds = parseClientAuth(req);

  return {
    serverGame: null,
    playerId: creds.playerId,
    playerSecret: creds.playerSecret,
    update(game: Game) {
      res.write(`data: ${JSON.stringify(game)}\n\n`);
    }
  }
}

function updateGame(serverGame: ServerGame, data: GameEvent): any {
  console.log(data);
  if (data.type === 'player-explore-action') {
    const result = triggerExploreAction(serverGame.game, data);
    serverGame.game = result.game;
    return result.tile;
  } else if (data.type === 'player-place-tile') {
    const result = triggerTilePick(serverGame.game, data);
    serverGame.game = result;
    return null;
  }
}

server.listen(port, () => {
  console.log(`listening on ${port}`)
})
