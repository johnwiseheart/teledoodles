import * as events from "events";

import {
  IGame,
  IGenericMessage,
  LISTENER_EVENT,
  messageIsAddPageMessage,
  messageIsJoinMessage,
  messageIsReadyMessage,
  messageIsStartMessage,
} from "teledoodles-lib";
import {
  handleMessage,
} from "./events";

export interface IStoreState {
  games: { [gameCode: string]: IGame };
  players: { [playerId: string]: WebSocket };
}

export const configureStore = (initState: IStoreState) => {
  const eventEmitter = new events.EventEmitter();

  let allGames: IStoreState = initState;

  eventEmitter.on(LISTENER_EVENT, message => {
    allGames = handleMessage(allGames, message)
  });

  return {
    dispatch: (event: IGenericMessage) => {
      return eventEmitter.emit(LISTENER_EVENT, event);
    },
    isGameCodeAvailable: (gameCode: string) => {
      return Object.keys(allGames.games).indexOf(gameCode) === -1
    }
  };
};

export const initialState: IStoreState = {
  games: {},
  players: {},
};
