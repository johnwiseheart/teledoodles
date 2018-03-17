import { Router } from "react-router";
import { TurnType } from "teledoodles-lib";
import { IStoreState, GameView, WebsocketStatus } from "../store";

// tslint:disable
const initialState: IStoreState = {
  game: {
    gameCode: "",
    books: {},
    players: {},
    host: undefined,
    gameMode: undefined
  },
  router: {} as Router,
  websocketStatus: WebsocketStatus.CLOSED,
  gameView: GameView.HOME
};

export default initialState;
