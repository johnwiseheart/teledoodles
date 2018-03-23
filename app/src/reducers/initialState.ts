import { Router } from "react-router";
import { IStoreState, WebsocketStatus } from "../store";

const initialState: IStoreState = {
  errors: [],
  game: {
    books: {},
    gameCode: undefined,
    gameMode: undefined,
    host: undefined,
    players: {},
  },
  // tslint:disable-next-line:no-object-literal-type-assertion
  router: {} as Router,
  websocketStatus: WebsocketStatus.CLOSED,
};

export default initialState;
