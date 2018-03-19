import iassign from "immutable-assign";
import { every } from "lodash";
import {
  GameMode,
  IAddPageMessage,
  IErrorMessage,
  IInfoMessage,
  IJoinMessage,
  IReadyMessage,
  IStartMessage,
  messageIsJoinMessage,
  MessageType,
} from "teledoodles-lib";
import { IStoreState } from "./store";

export const sendGameInfo = (allGames: IStoreState, gameCode: string) => {
  const gamePlayers = allGames.games[gameCode].players;
  Object.keys(gamePlayers)
    .map(key => gamePlayers[key])
    .forEach(player => {
      const playerSocket = allGames.players[player.id];
      if (playerSocket.readyState === playerSocket.OPEN) {
        const infoMessage: IInfoMessage = {
          gameCode,
          payload: { game: allGames.games[gameCode] },
          playerId: player.id,
          type: MessageType.INFO,
        };
        playerSocket.send(JSON.stringify(infoMessage));
      } else {
        // remove player
      }
    });
};

export const sendError = (
  allGames: IStoreState,
  gameCode: string,
  playerId: string,
  error: string,
) => {
  const playerSocket = allGames.players[playerId];
  if (playerSocket.readyState === playerSocket.OPEN) {
    const infoMessage: IErrorMessage = {
      gameCode,
      payload: { error },
      playerId,
      type: MessageType.ERROR,
    };
    playerSocket.send(JSON.stringify({ type: MessageType.ERROR, payload: { error } }));
  } else {
    // remove player
  }
};

export const handleJoinMessage = (allGames: IStoreState, message: IJoinMessage) => {
  const { playerId, gameCode } = message;
  let currentGame = allGames.games[gameCode];

  // if no game exists, create a new game with user as host
  if (currentGame === undefined) {
    currentGame = {
      books: {},
      errorMessage: undefined,
      gameCode,
      gameMode: GameMode.LOBBY,
      host: playerId,
      players: {},
    };
  }

  if (currentGame.players[playerId] !== undefined) {
    sendGameInfo(allGames, gameCode);
  } else if (currentGame.gameMode === GameMode.GAME || currentGame.gameMode === GameMode.SHOWCASE) {
    sendError(allGames, gameCode, playerId, "You can't join a game that has started");
  } else {
    // Add user to game with readyState false
    currentGame.players[playerId] = {
      books: [{ pages: [], id: playerId }], // array with empty book
      id: playerId,
      isReady: false,
      next: undefined,
      prev: undefined, // Prev/next are set when the game is ready to begin
      username: message.payload.username,
    };

    // Add empty book for user
    currentGame.books[playerId] = { pages: [], id: playerId };

    const newAllGames = iassign(allGames, s => {
      s.games[gameCode] = currentGame;
      return s;
    });
    sendGameInfo(newAllGames, gameCode);
    return newAllGames;
  }
  return allGames;
};

export const handleReadyMessage = (allGames: IStoreState, message: IReadyMessage) => {
  const { gameCode, playerId } = message;
  const currentGame = allGames.games[gameCode];

  // If we get a join message for a game that doesnt exist, return error
  if (currentGame === undefined) {
    sendError(allGames, gameCode, playerId, "Tried to ready up for a game that doesnt exist.");
    return allGames;
  } else if (currentGame.players[playerId] === undefined) {
    allGames[gameCode] = { errorMessage: "Tried to ready a player which doesnt exist" };
  }

  // Set player to ready
  currentGame.players[playerId].isReady = message.payload.isReady;

  // If all players are now ready && number of players is >= 4, set lobby state to LOBBY_READY
  if (Object.keys(currentGame.players).length >= 1) {
    const allReady = every(currentGame.players, player => player.isReady);
    currentGame.gameMode = allReady ? GameMode.LOBBY_READY : GameMode.LOBBY;
  }

  const newAllGames = iassign(allGames, s => {
    s.games[gameCode] = currentGame;
    return s;
  });
  sendGameInfo(newAllGames, gameCode);
  return newAllGames;
};

export const handleStartMessage = (allGames: IStoreState, message: IStartMessage) => {
  const { gameCode, playerId } = message;
  const currentGame = allGames.games[gameCode];

  // If we're trying to start a game that doesnt exist, return error
  if (currentGame === undefined) {
    sendError(allGames, gameCode, playerId, "Tried to start a game that doesnt exist.");
    return allGames;
  }

  // Set prev/next for all players now that the game is ready to begin
  let prevKey: string;
  let firstKey: string;
  Object.keys(currentGame.players).forEach(key => {
    if (firstKey === undefined) {
      firstKey = key;
    }
    if (prevKey !== undefined) {
      currentGame.players[prevKey].next = key;
    }
    currentGame.players[key].prev = prevKey;
    prevKey = key;
  });
  // The above loop doesnt set the prev for the first player or next for the last player
  // set those here:
  currentGame.players[firstKey].prev = prevKey;
  currentGame.players[prevKey].next = firstKey;

  // set game mode to GAME
  currentGame.gameMode = GameMode.GAME;

  const newAllGames = iassign(allGames, s => {
    s.games[gameCode] = currentGame;
    return s;
  });
  sendGameInfo(newAllGames, gameCode);
  return newAllGames;
};

export const handleAddPageMessage = (allGames: IStoreState, message: IAddPageMessage) => {
  const { gameCode, playerId } = message;
  const currentGame = allGames.games[gameCode];
  const numUsers = Object.keys(currentGame.players).length;
  const currentPlayer = currentGame.players[playerId];

  // Add the page to the book map for the game
  currentGame.books[message.payload.bookId].pages.push(message.payload.page);

  // Add the page to the book map for the queue
  currentPlayer.books[0].pages.push(message.payload.page);

  // Remove the book from the current player's queue and add it to the next player's queue.
  const currBook = currentPlayer.books.shift();

  // Only add book to next player's queue if it's not full

  const nextPlayer = currentPlayer.next;
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

  const newAllGames = iassign(allGames, s => {
    s.games[gameCode].players[playerId] = currentPlayer;
    return s;
  });
  sendGameInfo(newAllGames, gameCode);
  return newAllGames;
};

export const handlePlayerWebsocketSet = (state, event) => {
  const { playerId, payload } = event;
  return iassign(state, s => {
    s.players[playerId] = payload;
    return s;
  });
};
