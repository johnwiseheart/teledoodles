import iassign from "immutable-assign";
import {
  IAddPageMessage,
  IJoinMessage,
  IReadyMessage,
  IStartMessage,
  messageIsJoinMessage
} from "teledoodles-lib";
import { IStoreState, Listener } from "./store";

export const sendGameInfo = (state: IStoreState, gameCode: string) => {
  // tslint:disable-next-line
  console.log(state.games);
  const gamePlayers = state.games[gameCode].players;
  Object.keys(gamePlayers)
    .map(key => gamePlayers[key])
    .forEach(player => {
      const playerSocket = state.players[player.id];
      if (playerSocket.readyState === playerSocket.OPEN) {
        playerSocket.send(JSON.stringify({ type: "GAME:INFO", game: state.games[gameCode] }));
      } else {
        // remove player
      }
    });
};

export const handleJoinMessage = (gameInfo: IStoreState, message: IJoinMessage) => {
  return gameInfo;
};

export const handleReadyMessage = (gameInfo: IStoreState, message: IReadyMessage) => {
  return gameInfo;
};

export const handleStartMessage = (gameInfo: IStoreState, message: IStartMessage) => {
  return gameInfo;
};

export const handleAddPageMessage = (gameInfo: IStoreState, message: IAddPageMessage) => {
  return gameInfo;
};

// export const gameJoinEvent: Listener = (state, message) => {
//   if (messageIsJoinMessage(message)) {
//     const { gameCode, playerId, payload: { username } } = event;
//     const newState = iassign(state, s => {
//       if (state.games[gameCode] === undefined) {
//         s.games[gameCode] = {
//           gameCode,
//           players: {},
//           turnType: TurnType.LOBBY
//         };
//       }

//       s.games[gameCode].players[playerId] = {
//         id: playerId,
//         isReady: false,
//         username
//       };
//       return s;
//     });
//     sendGameInfo(newState, gameCode);
//     return newState;
//   }
//   return state;
// };

// export const gameReadyEvent: Listener = (state, event) => {
//   if (eventIsGameEvent(event) && event.type === "GAME:READY") {
//     const { gameCode, playerId, payload: { isReady } } = event;

//     // check if all players are ready and theres atleast 4 player
//     let newState = iassign(state, s => {
//       s.games[gameCode].players[playerId].isReady = isReady;
//       return s;
//     });

//     const readyPlayers = Object.keys(newState.games[gameCode].players)
//       .map(key => newState.games[gameCode].players[key])
//       .filter(player => player.isReady);

//     if (readyPlayers.length === 4) {
//       newState = iassign(state, s => {
//         s.games[gameCode].turnType = TurnType.CHOOSE_WORD;
//         return s;
//       });
//     }

//     sendGameInfo(newState, gameCode);
//     return newState;
//   }

//   return state;
// };

export const handlePlayerWebsocketSet: Listener = (state, event) => {
  const { playerId, payload } = event;
  return iassign(state, s => {
    s.players[playerId] = payload;
    return s;
  });
};
