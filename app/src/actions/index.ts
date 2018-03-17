import { Dispatch } from "react-redux";
import actionCreatorFactory from "typescript-fsa";
import { IStoreState, Message, Page } from "../store";
import { getPlayerInfo } from "../util";
import { IJoinMessage } from "teledoodles-lib";

const actionCreator = actionCreatorFactory();

export const gameJoin = actionCreator<{ gameCode: string }>("GAME:JOIN");
export const gameReady = actionCreator<boolean>("GAME:READY");

export const pageChange = actionCreator<Page>("PAGE:CHANGE");

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
      // tslint:disable-next-line
      console.log(gameCode);
      dispatch(
        websocketConnect({
          messages: [{ type: "JOIN", gameCode, playerId, payload: { username } }]
        })
      );
      dispatch(pageChange(Page.LOBBY));
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
        // dispatch(gameJoin({ gameCode }));
      });
  };
};

export const readyGame = (isReady: boolean) => {
  return (dispatch: Dispatch<IStoreState>, getState: () => IStoreState) => {
    dispatch(
      websocketSend({
        gameCode: getState().game.gameCode,
        payload: { isReady },
        playerId: getPlayerInfo().id,
        type: "READY"
      })
    );
    dispatch(gameReady(isReady));
  };
};

export const changePage = (page: Page) => {
  return (dispatch: Dispatch<IStoreState>) => {
    dispatch(pageChange(page));
  };
};
