import {
  GameMode,
  IAddPageMessage,
  IBook,
  IGame,
  IJoinMessage,
  IPage,
  IPlayer,
  IReadyMessage,
  IStartMessage,
  ITextPage,
  MessageType,
  pageIsTextPage,
  PageType,
} from "teledoodles-lib";
import { handleAddPageMessage, handleJoinMessage, handleMessage, handleReadyMessage, handleStartMessage } from "../events";
import { initialState, IStoreState } from "../store";

/*
 * These tests are kinda dodgy in that each subsequent group of tests strongly depends on the functionality
 * of the prior tests. In the future, maybe properly creating the relevant game states would be good so that
 * we can test just one function per test.
 */

interface IPlayerMap {
  [id: string]: IPlayer;
}
interface IBookMap {
  [id: string]: IBook;
}

const createGame = (
  players: IPlayerMap,
  books: IBookMap,
  gameCode: string = "AAAA",
  gameMode: GameMode = GameMode.LOBBY,
): IGame => ({
  books,
  gameCode,
  gameMode,
  host: Object.keys(players)[0],
  players,
});

const createPlayer = (
  books: IBook[],
  username: string = "player1",
  isReady: boolean = false,
): IPlayer => ({
  books,
  id: "id",
  isReady,
  next: undefined,
  prev: undefined,
  username,
});

const createReadyMessage = (
  gameCode: string,
  playerId: string,
  isReady: boolean,
): IReadyMessage => ({
  gameCode,
  payload: {
    isReady,
  },
  playerId,
  type: MessageType.READY,
});

const createStartMessage = (
  gameCode: string,
  playerId: string,
): IStartMessage => ({
  gameCode,
  payload: {},
  playerId,
  type: MessageType.START,
  });

const createAddPageMessage = (
  gameCode: string,
  playerId: string,
  bookId: string,
  page: IPage,
): IAddPageMessage => ({
  gameCode,
  payload: {
    bookId,
    page,
  },
  playerId,
  type: MessageType.ADD_PAGE,
});

const createJoinMessage = (gameCode: string, playerId: string, username: string): IJoinMessage => ({
  gameCode,
  payload: {
    username,
  },
  playerId,
  type: MessageType.JOIN,
});

describe("Test game creation", () => {
  let events;
  let allGames: IStoreState;

  // setup game
  const gameCode = "AAAA";
  const playerId = "1";
  const username = "player1";

  beforeAll(() => {
    events = require("../events");
    events.sendGameInfo = jest.fn();
    events.handleJoinMessage = jest.fn(handleJoinMessage)

    // setup state
    const message: IJoinMessage = createJoinMessage(gameCode, playerId, username);
    allGames = handleMessage(initialState, message);
  });

  test("Game exists", () => {
    expect(allGames.games[gameCode]).not.toBe(undefined);
  });

  test("Game's host is player'", () => {
    expect(allGames.games[gameCode].host).toBe(playerId);
  });

  test("Player exists in game", () => {
    expect(allGames.games[gameCode].players[playerId]).not.toBe(undefined);
  });

  test("Player has an empty book", () => {
    expect(allGames.games[gameCode].players[playerId].books.length).toBeGreaterThan(0);

    const emptyBook: IBook = {
      id: playerId,
      pages: [],
    };

    expect(allGames.games[gameCode].players[playerId].books[0].id).toBe(playerId);
    expect(allGames.games[gameCode].players[playerId].books[0].pages.length).toBe(0);
  });

  test("Player's username is set", () => {
    expect(allGames.games[gameCode].players[playerId].username).toBe(username);
  });

  test("handleJoinMessage was called", () => {
    expect(events.handleJoinMessage).toBeCalled();
  });

  test("Game info sent to the players", () => {
    expect(events.sendGameInfo).toBeCalled();
  });
});

describe("Test game ready", () => {
  let events;
  let allGames: IStoreState;

  // setup game
  const gameCode = "AAAA";
  const playerId1 = "1";
  const username1 = "player1";
  const playerId2 = "2";
  const username2 = "player2";

  beforeAll(() => {
    events = require("../events");
    events.sendGameInfo = jest.fn();
    events.handleReadyMessage = jest.fn(handleReadyMessage)

    // join one player
    allGames = handleMessage(initialState, createJoinMessage(gameCode, playerId1, username1));
  });

  test("Player set to ready is ready", () => {
    allGames = handleMessage(allGames, createReadyMessage(gameCode, playerId1, true));
    expect(allGames.games[gameCode].players[playerId1].isReady).toBe(true);
  });

  test("Player set to not-ready is not-ready", () => {
    allGames = handleMessage(allGames, createReadyMessage(gameCode, playerId1, false));
    expect(allGames.games[gameCode].players[playerId1].isReady).toBe(false);
  });

  test("GameMode is not changed to LOBBY_READY if no players are ready", () => {
    allGames = handleMessage(allGames, createJoinMessage(gameCode, playerId2, username2));
    expect(allGames.games[gameCode].gameMode).toBe(GameMode.LOBBY);
  });

  test("GameMode is not changed to LOBBY_READY if some players are ready", () => {
    allGames = handleMessage(allGames, createReadyMessage(gameCode, playerId1, true));
    expect(allGames.games[gameCode].gameMode).toBe(GameMode.LOBBY);
  });

  test("GameMode is changed to LOBBY_READY if all players are ready", () => {
    allGames = handleMessage(allGames, createReadyMessage(gameCode, playerId2, true));
    expect(allGames.games[gameCode].gameMode).toBe(GameMode.LOBBY_READY);
  });

  test("GameMode is changed back to LOBBY if a players are un-readies", () => {
    allGames = handleMessage(allGames, createReadyMessage(gameCode, playerId1, false));
    expect(allGames.games[gameCode].gameMode).toBe(GameMode.LOBBY);
  });

  test("handleReadyMessage was called", () => {
    expect(events.handleReadyMessage).toBeCalled();
  });

  test("Game info sent to the players", () => {
    expect(events.sendGameInfo).toBeCalled();
  });
});

describe("Test game start", () => {
  let events;
  let allGames: IStoreState;

  // setup game
  const gameCode = "AAAA";
  const playerId1 = "1";
  const username1 = "player1";
  const playerId2 = "2";
  const username2 = "player2";

  beforeAll(() => {
    events = require("../events");
    events.sendGameInfo = jest.fn();
    events.handleStartMessage = jest.fn(handleStartMessage)

    // setup state
    allGames = handleMessage(initialState, createJoinMessage(gameCode, playerId1, username1));
    allGames = handleMessage(allGames, createJoinMessage(gameCode, playerId2, username2));
    allGames = handleMessage(allGames, createReadyMessage(gameCode, playerId1, true));
    allGames = handleMessage(allGames, createReadyMessage(gameCode, playerId2, true));
    allGames = handleMessage(allGames, createStartMessage(gameCode, playerId1));
  });

  test("GameMode is set to GAME if start message sent", () => {
    expect(allGames.games[gameCode].gameMode).toBe(GameMode.GAME);
  });

  // it would be better if we could check that they were correct
  test("All players have a next and a previous", () => {
    Object.keys(allGames.games[gameCode].players).forEach(key => {
      const player = allGames.games[gameCode].players[key];
      expect(player.prev).not.toBe(undefined);
      expect(player.next).not.toBe(undefined);
    });
  })

  test("handleStartMessage was called", () => {
    expect(events.handleStartMessage).toBeCalled();
  });

  test("Game info sent to the players", () => {
    expect(events.sendGameInfo).toBeCalled();
  });
});

describe("Test game add page", () => {
  let events;
  let allGames: IStoreState;

  // setup game
  const gameCode = "AAAA";
  const playerId1 = "1";
  const username1 = "player1";
  const playerId2 = "2";
  const username2 = "player2";

  beforeAll(() => {
    events = require("../events");
    events.sendGameInfo = jest.fn();
    events.handleAddPageMessage = jest.fn(handleAddPageMessage)

    // setup state
    allGames = handleMessage(initialState, createJoinMessage(gameCode, playerId1, username1));
    allGames = handleMessage(allGames, createJoinMessage(gameCode, playerId2, username2));
    allGames = handleMessage(allGames, createReadyMessage(gameCode, playerId1, true));
    allGames = handleMessage(allGames, createReadyMessage(gameCode, playerId2, true));
    allGames = handleMessage(allGames, createStartMessage(gameCode, playerId1));
  });

  test("Created page gets put on the end of the next players queue", () => {
    const textPage: ITextPage = {
      pageType: PageType.TEXT,
      playerId: playerId1,
      text: "Hello",
    }

    allGames = handleMessage(allGames, createAddPageMessage(gameCode, playerId1, playerId1, textPage));
    expect(pageIsTextPage(allGames.games[gameCode].players[playerId2].books[1].pages[0])).toBeTruthy();
    expect(allGames.games[gameCode].players[playerId2].books[0].id).toBe(playerId2);
    expect(allGames.games[gameCode].players[playerId2].books[1].id).toBe(playerId1);
  });


  test("handleAddPageMessage was called", () => {
    expect(events.handleStartMessage).toBeCalled();
  });

  test("Game info sent to the players", () => {
    expect(events.sendGameInfo).toBeCalled();
  });
});

