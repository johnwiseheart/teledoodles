import { Router } from "react-router";
import {
  IGame,
  IGenericMessage,
  IJoinMessage,
  IReadyMessage,
  IStartMessage,
  IAddPageMessage
} from "teledoodles-lib";

export type Message = IJoinMessage | IReadyMessage | IStartMessage | IAddPageMessage;

export enum WebsocketStatus {
  CLOSED = "CLOSED",
  OPENING = "OPENING",
  OPEN = "OPEN"
}

export enum GameView {
  HOME = "HOME",
  LOBBY = "LOBBY",
  CHOOSE_WORD = "CHOOSE_WORD",
  DOODLE_WORD = "DOODLE_WORD",
  GUESS_DOODLE = "GUESS_DOODLE",
  END = "END",
  PLAYER_INFO = "PLAYER_INFO"
}

export interface IStoreState {
  game: IGame;
  router: Router;
  websocketStatus: WebsocketStatus;
}
