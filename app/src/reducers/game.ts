import { Action } from "redux";
import {
  IGame,
  IGenericMessage,
  IInfoMessage,
  messageIsErrorMessage,
  messageIsInfoMessage,
  MessageType,
} from "teledoodles-lib";
import { isType } from "typescript-fsa";
import {
  gameJoin,
  websocketClose,
  websocketConnect,
  websocketMessage,
  websocketOpen,
} from "../actions";
import { WebsocketStatus } from "../store";
import initialState from "./initialState";

const game = (state: IGame = initialState.game, action: Action): IGame => {
  if (isType(action, gameJoin)) {
    return {
      ...state,
      gameCode: action.payload.gameCode,
    };
  }

  if (isType(action, websocketMessage)) {
    const parsed: IGenericMessage = JSON.parse(action.payload.event.data);

    if (messageIsInfoMessage(parsed)) {
      return {
        ...state,
        ...parsed.payload.game,
      };
    }

    if (messageIsErrorMessage(parsed)) {
      alert(parsed.payload.error);
    }
  }

  return state;
};

export default game;
