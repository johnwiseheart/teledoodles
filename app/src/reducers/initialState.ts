import { Router } from "react-router";
import { TurnType } from "teledoodles-lib";
import { GameView, IStoreState, WebsocketStatus } from "../store";

const initialState: IStoreState = {
  game: {
    books: {},
    gameCode: "",
    gameMode: undefined,
    host: undefined,
    players: {},
  },
  // tslint:disable-next-line:no-object-literal-type-assertion
  router: {} as Router,
  websocketStatus: WebsocketStatus.CLOSED,
};

export default initialState;
