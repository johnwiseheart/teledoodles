import { Router } from "react-router";
import {
  IAddPageMessage,
  IGame,
  IGenericMessage,
  IJoinMessage,
  IReadyMessage,
  IStartMessage,
} from "teledoodles-lib";

export type Message = IJoinMessage | IReadyMessage | IStartMessage | IAddPageMessage;

export enum WebsocketStatus {
  CLOSED = "CLOSED",
  OPENING = "OPENING",
  OPEN = "OPEN",
}

export interface IStoreState {
  game: IGame;
  router: Router;
  websocketStatus: WebsocketStatus;
  errors: string[];
}
