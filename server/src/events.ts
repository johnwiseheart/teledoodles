import iassign from "immutable-assign";
import {
  GameMode,
  IAddPageMessage,
  IJoinMessage,
  IReadyMessage,
  IStartMessage,
  messageIsJoinMessage
} from "teledoodles-lib";
import { IStoreState } from "./store";

export const sendGameInfo = (allGames: IStoreState, gameCode: string) => {
  const gamePlayers = allGames.games[gameCode].players;
  Object.keys(gamePlayers)
    .map(key => gamePlayers[key])
    .forEach(player => {
      const playerSocket = allGames.players[player.id];
      if (playerSocket.readyState === playerSocket.OPEN) {
        playerSocket.send(JSON.stringify({ type: "INFO", game: allGames.games[gameCode] }));
      } else {
        // remove player
      }
    });
};

export const handleJoinMessage = (allGames: IStoreState, message: IJoinMessage) => {
  // if no game exists, create a new game with user as host
  if (allGames.games[message.gameCode] === undefined) {
    allGames.games[message.gameCode] = {
      books: {},
      errorMessage: undefined,
      gameCode: message.gameCode,
      gameMode: GameMode.LOBBY,
      host: message.playerId,
      players: {},
    };
  }

  // if the user is in the game already, then just send them the game info
  if (allGames.games[message.gameCode].players[message.playerId] === undefined) {
    // Add user to game with readyState false
    allGames.games[message.gameCode].players[message.playerId] = {
      books: [{ pages: [], id: message.playerId }], // array with empty book
      id: message.playerId,
      isReady: false,
      next: undefined,
      prev: undefined, // Prev/next are set when the game is ready to begin
      username: message.payload.username,
    };

    // Add empty book for user
    allGames.games[message.gameCode].books[message.playerId] = { pages: [], id: message.playerId };
  }

  sendGameInfo(allGames, message.gameCode);
  return allGames;
};

export const handleReadyMessage = (allGames: IStoreState, message: IReadyMessage) => {
  // If we get a join message for a game that doesnt exist, return error
  if (allGames.games[message.gameCode] === undefined) {
    allGames[message.gameCode] = {
      errorMessage: "Tried to ready up for a game that doesnt exist."
    };
    return allGames;
  } else if (allGames.games[message.gameCode].players[message.playerId] === undefined) {
    allGames[message.gameCode] = { errorMessage: "Tried to ready a player which doesnt exist" };
  }

  // Set player to ready
  allGames.games[message.gameCode].players[message.playerId].isReady = message.payload.isReady;

  // If all players are now ready && number of players is >= 4, set lobby state to LOBBY_READY
  if (Object.keys(allGames.games[message.gameCode].players).length >= 1) {
    let allReady = true;
    for (const key in allGames.games[message.gameCode].players) {
      if (allGames.games[message.gameCode].players[key].isReady !== true) {
        allReady = false;
        break;
      }
    }
    allGames.games[message.gameCode].gameMode = allReady ? GameMode.LOBBY_READY : GameMode.LOBBY;
  }

  sendGameInfo(allGames, message.gameCode);
  return allGames;
};

export const handleStartMessage = (allGames: IStoreState, message: IStartMessage) => {
  // If we're trying to start a game that doesnt exist, return error
  if (allGames.games[message.gameCode] === undefined) {
    allGames[message.gameCode] = { errorMessage: "Tried to start a game that doesnt exist." };
    return allGames;
  }

  // Set prev/next for all players now that the game is ready to begin
  let prevKey: string;
  let firstKey: string;
  Object.keys(allGames.games[message.gameCode].players).forEach(key => {
    if (firstKey === undefined) {
      firstKey = key;
    }
    if (prevKey !== undefined) {
      allGames.games[message.gameCode].players[prevKey].next = key;
    }
    allGames.games[message.gameCode].players[key].prev = prevKey;
    prevKey = key;
  })
  // The above loop doesnt set the prev for the first player or next for the last player
  // set those here:
  allGames.games[message.gameCode].players[firstKey].prev = prevKey;
  allGames.games[message.gameCode].players[prevKey].next = firstKey;

  // set game mode to GAME
  allGames.games[message.gameCode].gameMode = GameMode.GAME;

  sendGameInfo(allGames, message.gameCode);
  return allGames;
};

export const handleAddPageMessage = (allGames: IStoreState, message: IAddPageMessage) => {
  const currentGame = allGames.games[message.gameCode];
  const numUsers = Object.keys(currentGame.players).length;

  // Add the page to the book map for the game
  currentGame.books[message.payload.bookId].pages.push(message.payload.page);

  // Add the page to the book map for the queue
  currentGame.players[message.playerId].books[0].pages.push(message.payload.page);

  // Remove the book from the current player's queue and add it to the next player's queue.
  const currBook = currentGame.players[message.playerId].books.shift();

  // Only add book to next player's queue if it's not full

  const nextPlayer = currentGame.players[message.playerId].next;
  if (currBook.pages.length < numUsers) {
    currentGame.players[nextPlayer].books.push(currBook);
  }

  // Finally, check if the game is complete; if every book has as many pages as there are
  // players, set the game mode to SHOWCASE
  let gameOver = true;

  for (const key in currentGame.books) {
    if (currentGame.books[key].pages.length < numUsers) {
      gameOver = false;
      break;
    }
  }

  if (gameOver) {
    currentGame.gameMode = GameMode.SHOWCASE;
  }

  sendGameInfo(allGames, message.gameCode);
  return allGames;
};

export const handlePlayerWebsocketSet = (state, event) => {
  const { playerId, payload } = event;
  return iassign(state, s => {
    s.players[playerId] = payload;
    return s;
  });
};
