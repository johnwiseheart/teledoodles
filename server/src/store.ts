import * as events from "events";

import { IGame, IGenericMessage, LISTENER_EVENT, messageIsAddPageMessage, messageIsJoinMessage, messageIsReadyMessage, messageIsStartMessage } from "teledoodles-lib";

export interface IStoreState {
  games: { [gameCode: string]: IGame };
  players: { [playerId: string]: WebSocket };
}


export type Listener = (state: IStoreState, message: IGenericMessage) => IStoreState;

export interface IListenerInfo {
  type: string;
  listener: Listener;
}

export const configureStore = (initState: IStoreState, listeners: Listener[]) => {
  const eventEmitter = new events.EventEmitter();

  let gameInfo: IStoreState = initState;

  eventEmitter.on(LISTENER_EVENT, message => {
    if (messageIsJoinMessage(message)) {
      gameInfo = handleJoinMessage(gameInfo, message);
    } else if (messageIsReadyMessage(message)) {
      gameInfo = handleReadyMessage(gameInfo, message);
    } else if (messageIsStartMessage(message)) {
      gameInfo = handleStartMessage(gameInfo, message);
    } else if (messageIsAddPageMessage(message)) {
      gameInfo = handleAddPageMessage(gameInfo, message);
    }
  });

  return {
    dispatch: (event: IGenericMessage) => {
      return eventEmitter.emit(LISTENER_EVENT, event);
    }
  };
};

export const initialState: IStoreState = {
  games: {},
  players: {}
};
