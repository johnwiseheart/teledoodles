import { WebsocketStatus, Page } from '../store';
import initialState from './initialState';
import { gameJoin, websocketMessage, websocketOpen, websocketClose, websocketConnect } from '../actions';
import { Action } from 'redux';
import { isType } from 'typescript-fsa';
import { Game } from "teledoodles-lib";

const game = (state: Game = initialState.game, action: Action): Game => {
  if (isType(action, gameJoin)) {
    return {
      ...state,
      gameCode: action.payload.gameCode,
    };
  }

  if (isType(action, websocketMessage)) {
    const parsed = JSON.parse(action.payload.event.data);

    if (parsed.type === 'GAME:INFO') {
      // tslint:disable-next-line
      console.log(parsed.game.players);
      return {
        ...state,
        players: parsed.game.players,
      };
    }
  }

  return state;
};

export default game;