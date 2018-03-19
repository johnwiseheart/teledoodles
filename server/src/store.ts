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
  handleAddPageMessage,
  handleJoinMessage,
  handlePlayerWebsocketSet,
  handleReadyMessage,
  handleStartMessage,
} from "./events";

export interface IStoreState {
  games: { [gameCode: string]: IGame };
  players: { [playerId: string]: WebSocket };
}

export const configureStore = (initState: IStoreState) => {
  const eventEmitter = new events.EventEmitter();

  let allGames: IStoreState = initState;

  eventEmitter.on(LISTENER_EVENT, message => {
    if (messageIsJoinMessage(message)) {
      allGames = handleJoinMessage(allGames, message);
    } else if (messageIsReadyMessage(message)) {
      allGames = handleReadyMessage(allGames, message);
    } else if (messageIsStartMessage(message)) {
      allGames = handleStartMessage(allGames, message);
    } else if (messageIsAddPageMessage(message)) {
      allGames = handleAddPageMessage(allGames, message);
    } else if (message.type === "PLAYER:WEBSOCKET:SET") {
      allGames = handlePlayerWebsocketSet(allGames, message);
    }
  });

  return {
    dispatch: (event: IGenericMessage) => {
      return eventEmitter.emit(LISTENER_EVENT, event);
    },
  };
};

export const initialState: IStoreState = {
  games: {},
  players: {},
};
