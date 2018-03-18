import { Action } from "redux";
import { isType } from "typescript-fsa";
import {
  gameJoin,
  gameViewChange,
  websocketClose,
  websocketConnect,
  websocketMessage,
  websocketOpen
} from "../actions";
import { GameView, WebsocketStatus } from "../store";
import initialState from "./initialState";

const page = (state: GameView = initialState.gameView, action: Action): GameView => {
  if (isType(action, gameViewChange)) {
    console.log(action.payload)
    return action.payload;
  }

  return state;
};

export default page;
