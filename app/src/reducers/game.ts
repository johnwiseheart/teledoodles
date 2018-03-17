import { Action } from "redux";
import { IGame } from "teledoodles-lib";
import { isType } from "typescript-fsa";
import {
  gameJoin,
  websocketClose,
  websocketConnect,
  websocketMessage,
  websocketOpen
} from "../actions";
import { GameView, WebsocketStatus } from "../store";
import initialState from "./initialState";

const game = (state: IGame = initialState.game, action: Action): IGame => {
  if (isType(action, gameJoin)) {
    return {
      ...state,
      gameCode: action.payload.gameCode
    };
  }

  if (isType(action, websocketMessage)) {
    const parsed = JSON.parse(action.payload.event.data);

    if (parsed.type === "GAME:INFO") {
      // tslint:disable-next-line
      console.log(parsed.game.players);
      return {
        ...state,
        players: parsed.game.players
      };
    }
  }

  return state;
};

export default game;
