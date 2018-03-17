import { Router } from "react-router";
import { IGame, IGenericMessage } from "teledoodles-lib";

export interface IGameJoinMessage extends IGenericMessage {
  type: "GAME:JOIN";
  payload: {
    username: string;
  };
}

export interface IGameReadyMessage extends IGenericMessage {
  type: "GAME:READY";
  payload: {
    isReady: boolean;
  };
}

export type Message = IGameJoinMessage | IGameReadyMessage;

export enum WebsocketStatus {
  CLOSED = "CLOSED",
  OPENING = "OPENING",
  OPEN = "OPEN"
}

export enum Page {
  HOME = "HOME",
  LOBBY = "LOBBY",
  CHOOSE_WORD = "CHOOSE_WORD",
  DOODLE_WORD = "DOODLE_WORD",
  GUESS_DOODLE = "GUESS_DOODLE",
  END = "END"
}

export interface IStoreState {
  game: IGame;
  router: Router;
  websocketStatus: WebsocketStatus;
  page: Page;
}
