import { Action } from "redux";
import { isType } from "typescript-fsa";
import { gameJoin, websocketClose, websocketConnect, websocketMessage, websocketOpen } from "../actions";
import { WebsocketStatus } from "../store";
import initialState from "./initialState";

const websocketStatus = (state: string = initialState.websocketStatus, action: Action): string => {
  if (isType(action, websocketOpen)) {
    return WebsocketStatus.OPEN;
  }

  if (isType(action, websocketConnect)) {
    return WebsocketStatus.OPENING;
  }

  if (isType(action, websocketClose)) {
    return WebsocketStatus.CLOSED;
  }

  return state;
};

export default websocketStatus;
