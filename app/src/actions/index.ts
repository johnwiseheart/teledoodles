import { Dispatch } from "react-redux";
import actionCreatorFactory from "typescript-fsa";
import { IStoreState, Message, GameView } from "../store";
import { getPlayerInfo } from "../util";
import { IJoinMessage, IPage, IGenericMessage, IReadyMessage, IStartMessage, IAddPageMessage } from "teledoodles-lib";
import { push } from 'react-router-redux';

const actionCreator = actionCreatorFactory();

export const gameJoin = actionCreator<{ gameCode: string }>("GAME:JOIN");
export const gameReady = actionCreator<boolean>("GAME:READY");
export const gameStart = actionCreator("GAME:START");
export const gameAddPage = actionCreator<{ bookId: string, page: IPage }>("GAME:ADD_PAGE");

export const websocketSend = actionCreator<Message>("WEBSOCKET:SEND");
export const websocketConnect = actionCreator<{ messages?: Message[] }>("WEBSOCKET:CONNECT");
export const websocketDisconnect = actionCreator("WEBSOCKET:DISCONNECT");
export const websocketOpen = actionCreator("WEBSOCKET:OPEN");
export const websocketClose = actionCreator<{ event: Event }>("WEBSOCKET:CLOSE");
export const websocketMessage = actionCreator<{ event: MessageEvent }>("WEBSOCKET:MESSAGE");

export const joinGame = (gameCode: string) => {
  return (dispatch: Dispatch<IStoreState>) => {
    const playerInfo = getPlayerInfo();
    if (playerInfo) {
      const { id: playerId, username } = playerInfo;
      dispatch(gameJoin({ gameCode }));
      dispatch(
        websocketConnect({
          messages: [{ type: "JOIN", gameCode, playerId, payload: { username } }]
        })
      );
      dispatch(push(`/game/${gameCode}`));
    }
  };
};

export const newGame = () => {
  return (dispatch: Dispatch<IStoreState>) => {
    return fetch("http://localhost:5000/new")
      .then((resp: Response) => resp.json())
      .then(json => {
        const { gameCode } = json;
        dispatch(joinGame(gameCode));
      });
  };
};

export const readyGame = (isReady: boolean) => {
  return (dispatch: Dispatch<IStoreState>, getState: () => IStoreState) => {
    const message: IReadyMessage = {
      gameCode: getState().game.gameCode,
      payload: { isReady },
      playerId: getPlayerInfo().id,
      type: "READY",
    }

    dispatch(websocketSend(message));
    // dispatch(gameReady(isReady));
  };
};

export const startGame = () => {
  return (dispatch: Dispatch<IStoreState>, getState: () => IStoreState) => {
    const message: IStartMessage = {
      gameCode: getState().game.gameCode,
      payload: { },
      playerId: getPlayerInfo().id,
      type: "START",
    }

    dispatch(websocketSend(message));
    // dispatch(gameStart());
  };
};

export const addPage = (bookId: string, page: IPage) => {
  return (dispatch: Dispatch<IStoreState>, getState: () => IStoreState) => {
    const message: IAddPageMessage = {
      gameCode: getState().game.gameCode,
      payload: { bookId, page },
      playerId: getPlayerInfo().id,
      type: "ADD_PAGE",
    }

    dispatch(websocketSend(message));
    // dispatch(gameAddPage({ bookId, page }));
  };
}
