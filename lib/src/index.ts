export type PlayerId = string;

export interface IGenericMessage {
  type: string;
  gameCode: string;
  playerId: PlayerId;
  payload: any;
}

export enum PageType {
  IMAGE = "IMAGE",
  TEXT = "TEXT",
}

export enum GameMode {
  LOBBY = "LOBBY",
  LOBBY_READY = "LOBBY_READY",
  GAME = "GAME",
  SHOWCASE = "SHOWCASE",
}

export enum MessageType {
  JOIN = "JOIN",
  READY = "READY",
  START = "START",
  ADD_PAGE = "ADD_PAGE",
  INFO = "INFO",
  ERROR = "ERROR",
}

export interface IPage {
  playerId: PlayerId;
  pageType: PageType;
}

export interface IBook {
  pages: IPage[];
  id: string;
}

export interface ITextPage extends IPage {
  pageType: PageType.TEXT;
  text: string;
}

export const pageIsTextPage = (page: any): page is ITextPage => {
  return page.pageType === PageType.TEXT;
};

export interface IImagePage extends IPage {
  pageType: PageType.IMAGE;
  imageId: string;
}

export const pageIsImagePage = (page: any): page is IImagePage => {
  return page.pageType === PageType.IMAGE;
};

export interface IJoinMessage extends IGenericMessage {
  type: MessageType.JOIN;
  payload: {
    username: string;
  };
}

export const messageIsJoinMessage = (message: any): message is IJoinMessage => {
  return message.type === MessageType.JOIN;
};

export interface IReadyMessage extends IGenericMessage {
  type: MessageType.READY;
  payload: {
    isReady: boolean;
  };
}

export const messageIsReadyMessage = (message: any): message is IReadyMessage => {
  return message.type === MessageType.READY;
};

export interface IStartMessage extends IGenericMessage {
  type: MessageType.START;
}

export const messageIsStartMessage = (message: any): message is IStartMessage => {
  return message.type === MessageType.START;
};

export interface IAddPageMessage extends IGenericMessage {
  type: MessageType.ADD_PAGE;
  payload: {
    bookId: string;
    page: IPage;
  };
}

export const messageIsAddPageMessage = (message: any): message is IAddPageMessage => {
  return message.type === MessageType.ADD_PAGE;
};

export interface IInfoMessage extends IGenericMessage {
  type: MessageType.INFO;
  payload: {
    game: IGame;
  };
}

export const messageIsInfoMessage = (message: any): message is IInfoMessage => {
  return message.type === MessageType.INFO;
};

export interface IErrorMessage extends IGenericMessage {
  type: MessageType.ERROR;
  payload: {
    error: string;
  };
}

export const messageIsErrorMessage = (message: any): message is IErrorMessage => {
  return message.type === MessageType.ERROR;
};

export interface IPlayer {
  id: string;
  username: string;
  isReady: boolean;
  prev: PlayerId;
  next: PlayerId;
  books: IBook[];
}

export const LISTENER_EVENT = "LISTENER_EVENT";

export interface IGame {
  gameCode: string;
  books: { [id: string]: IBook };
  players: { [id: string]: IPlayer };
  host: PlayerId;
  gameMode: GameMode;
  errorMessage?: string;
}
