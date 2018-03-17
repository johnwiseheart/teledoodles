export type PlayerId = string;

export interface IGenericMessage {
  type: string;
  gameCode: string;
  playerId: PlayerId;
}

export enum PageType {
  IMAGE = "IMAGE",
  TEXT = "TEXT"
}

export enum GameMode {
  LOBBY = "LOBBY",
  GAME = "GAME",
  SHOWCASE = "SHOWCASE"
}

export interface IPage {
  playerId: PlayerId;
  pageType: PageType;
}

export interface IBook {
  pages: IPage[];
}

export interface ITextPage extends IPage {
  pageType: PageType.TEXT;
  text: string;
}

export interface IImagePage extends IPage {
  pageType: PageType.IMAGE;
  imageUrl: string;
}

export interface IJoinMessage extends IGenericMessage {
  type: "JOIN";
  payload: {
    username: string;
  };
}

export const messageIsJoinMessage = (message: any): message is IJoinMessage => {
  return message.type === "JOIN";
};

export interface IReadyMessage extends IGenericMessage {
  type: "READY";
  payload: {
    isReady: boolean;
  };
}

export const messageIsReadyMessage = (message: any): message is IReadyMessage => {
  return message.type === "READY";
};

export interface IStartMessage extends IGenericMessage {
  type: "START";
}

export const messageIsStartMessage = (message: any): message is IStartMessage => {
  return message.type === "STATE";
};


export interface IAddPageMessage extends IGenericMessage {
  type: "ADD_PAGE";
  bookId: string;
  page: IPage;
}

export const messageIsAddPageMessage = (message: any): message is IAddPageMessage => {
  return message.type === "ADD_PAGE";
};


export interface IInfo extends IGenericMessage {
  type: "INFO";
  game: IGame;
}

export interface IPlayer {
  id: string;
  username: string;
  isReady: boolean;
  prev: PlayerId;
  next: PlayerId;
  books: IBook[]
}

export const LISTENER_EVENT = "LISTENER_EVENT";

export enum TurnType {
  LOBBY = "LOBBY",
  CHOOSE_WORD = "CHOOSE_WORD",
  DOODLE_WORD = "DOODLE_WORD",
  GUESS_DOODLE = "GUESS_DOODLE",
  END = "END"
}

export interface IGame {
  gameCode: string;
  books: { [id: string]: IBook };
  players: { [id: string]: IPlayer };
  host: PlayerId;
  gameMode: GameMode;
}
