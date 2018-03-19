import { Dispatch } from "react-redux";
import { push } from "react-router-redux";
import {
  IAddPageMessage,
  IGenericMessage,
  IJoinMessage,
  IPage,
  IReadyMessage,
  IStartMessage,
  MessageType,
} from "teledoodles-lib";
import actionCreatorFactory from "typescript-fsa";
import { SERVER_URL } from '../config';
import { IStoreState, Message } from "../store";
import { getPlayerInfo } from "../utils";

const actionCreator = actionCreatorFactory();

export const gameJoin = actionCreator<{ gameCode: string }>("GAME:JOIN");
export const gameReady = actionCreator<boolean>("GAME:READY");
export const gameStart = actionCreator("GAME:START");
export const gameAddPage = actionCreator<{ bookId: string; page: IPage }>("GAME:ADD_PAGE");

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
          messages: [{ type: MessageType.JOIN, gameCode, playerId, payload: { username } }],
        }),
      );
      dispatch(push(`/game/${gameCode}`));
    }
  };
};

export const newGame = () => {
  return (dispatch: Dispatch<IStoreState>) => {
    return fetch("http://" + SERVER_URL + "/new")
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
      type: MessageType.READY,
    };

    dispatch(websocketSend(message));
  };
};

export const startGame = () => {
  return (dispatch: Dispatch<IStoreState>, getState: () => IStoreState) => {
    const message: IStartMessage = {
      gameCode: getState().game.gameCode,
      payload: {},
      playerId: getPlayerInfo().id,
      type: MessageType.START,
    };

    dispatch(websocketSend(message));
  };
};

export const addPage = (bookId: string, page: IPage) => {
  return (dispatch: Dispatch<IStoreState>, getState: () => IStoreState) => {
    const message: IAddPageMessage = {
      gameCode: getState().game.gameCode,
      payload: { bookId, page },
      playerId: getPlayerInfo().id,
      type: MessageType.ADD_PAGE,
    };

    dispatch(websocketSend(message));
  };
};
