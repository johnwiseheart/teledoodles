import produce from "immer";
import { every } from "lodash";
import {
  GameMode,
  IAddPageMessage,
  IErrorMessage,
  IGame,
  IGenericMessage,
  IInfoMessage,
  IJoinMessage,
  IReadyMessage,
  IStartMessage,
  messageIsAddPageMessage,
  messageIsJoinMessage,
  messageIsReadyMessage,
  messageIsStartMessage,
  MessageType,
} from "teledoodles-lib";
import { IStoreState } from "./store";

function GameException(message: string) {
  this.message = message;
  this.name = 'GameException';
}

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

const createEmptyGame = (gameCode: string, host: string) => ({
  books: {},
  errorMessage: undefined,
  gameCode,
  gameMode: GameMode.LOBBY,
  host,
  players: {},
});

export const handleMessage = (allGames: IStoreState, message: IGenericMessage): IStoreState => {
  const { gameCode, type, playerId } = message;
  if (type === "PLAYER:WEBSOCKET:SET") {
    return handlePlayerWebsocketSet(allGames, message);
  }

  try {
    const newGame = getUpdatedGame(allGames.games[gameCode], message);
    const newAllGames = produce(allGames, draftAllGames => {
      draftAllGames.games[gameCode] = newGame
    })
    sendGameInfo(newAllGames, gameCode);
    return newAllGames;
  } catch (err) {
    sendError(allGames, gameCode, playerId, err.message);
    return allGames;
  }
}

const getUpdatedGame = (game: IGame, message: IGenericMessage): IGame => {
  if (messageIsJoinMessage(message)) {
    return handleJoinMessage(game, message);
  } else if (messageIsReadyMessage(message)) {
    return handleReadyMessage(game, message);
  } else if (messageIsStartMessage(message)) {
    return handleStartMessage(game, message);
  } else if (messageIsAddPageMessage(message)) {
    return handleAddPageMessage(game, message);
  }
}

export const handleJoinMessage = (game: IGame, message: IJoinMessage): IGame => {
  const { playerId, gameCode } = message;

  if (game !== undefined) {
    if (game.players[playerId] !== undefined) {
      return game;
    } else if (game.gameMode === GameMode.GAME || game.gameMode === GameMode.SHOWCASE) {
      throw new GameException("You can't join a game that has started");
    }
  }
  const initialGame = game === undefined ? createEmptyGame(gameCode, playerId) : { ...game };

  return produce(initialGame, newGame => {
    // Add user to game with readyState false
    newGame.players[playerId] = {
      avatarFileId: message.payload.avatarFileId,
      books: [{ pages: [], id: playerId }], // array with empty book
      id: playerId,
      isReady: false,
      next: undefined,
      prev: undefined, // Prev/next are set when the game is ready to begin
      username: message.payload.username,
    };

    // Add empty book for user
    newGame.books[playerId] = { pages: [], id: playerId };
  });
};

export const handleReadyMessage = (game: IGame, message: IReadyMessage): IGame => {
  const { gameCode, playerId } = message;

  // If we get a join message for a game that doesnt exist, return error
  if (game === undefined) {
    throw new GameException("Tried to ready up for a game that doesnt exist.");
  } else if (game.players[playerId] === undefined) {
    throw new GameException("TTried to ready a player which doesnt exist.");
  }

  return produce(game, newGame => {
    // Set player to ready
    newGame.players[playerId].isReady = message.payload.isReady;

    // If all players are now ready && number of players is >= 4, set lobby state to LOBBY_READY
    if (Object.keys(newGame.players).length >= 1) {
      const allReady = every(newGame.players, player => player.isReady);
      newGame.gameMode = allReady ? GameMode.LOBBY_READY : GameMode.LOBBY;
    }
  });
};

export const handleStartMessage = (game: IGame, message: IStartMessage): IGame => {
  const { gameCode, playerId } = message;

  // If we're trying to start a game that doesnt exist, return error
  if (game === undefined) {
    throw new GameException("Tried to start a game that doesnt exist.");
  }

  return produce(game, newGame => {
    // Set prev/next for all players now that the game is ready to begin
    let firstKey;
    let prevKey;
    Object.keys(newGame.players).forEach(key => {
      if (firstKey === undefined) {
        firstKey = key;
      }
      if (prevKey !== undefined) {
        newGame.players[prevKey].next = key;
      }
      newGame.players[key].prev = prevKey;
      prevKey = key;
    });
    // The above loop doesnt set the prev for the first player or next for the last player
    // set those here:
    newGame.players[firstKey].prev = prevKey;
    newGame.players[prevKey].next = firstKey;

    // set game mode to GAME
    newGame.gameMode = GameMode.GAME;
  })
};

export const handleAddPageMessage = (game: IGame, message: IAddPageMessage): IGame => {
  const { gameCode, playerId } = message;

  // If we're trying to add a page on a game that doesnt exist, return error
  if (game === undefined) {
    throw new GameException("Tried to add a page to a game that doesnt exist.");
  }

  return produce(game, newGame => {
    const numUsers = Object.keys(newGame.players).length;
    const currentPlayer = newGame.players[playerId];

    // Add the page to the book map for the game
    newGame.books[message.payload.bookId].pages.push(message.payload.page);

    // Add the page to the book map for the queue
    currentPlayer.books[0].pages.push(message.payload.page);

    // Remove the book from the current player's queue and add it to the next player's queue.
    const currBook = currentPlayer.books.shift();

    // Only add book to next player's queue if it's not full
    const nextPlayer = currentPlayer.next;
    if (currBook.pages.length < numUsers) {
      newGame.players[nextPlayer].books.push(currBook);
    } else {
      // what happens if its full?
    }

    // Finally, check if the game is complete; if every book has as many pages as there are
    // players, set the game mode to SHOWCASE
    const gameOver = every(newGame.books, book => book.pages.length >= numUsers);
    if (gameOver) {
      newGame.gameMode = GameMode.SHOWCASE;
    }
  });
};

export const handlePlayerWebsocketSet = (state, event) => {
  const { playerId, payload } = event;
  return produce(state, s => {
    s.players[playerId] = payload;
  });
};
