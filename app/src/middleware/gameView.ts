import { push } from "react-router-redux";
import { Dispatch } from "redux";
import { Action } from "redux";
import { Middleware, MiddlewareAPI } from "redux";
import { isType } from "typescript-fsa";
import { gameViewChange } from "../actions";
import { IStoreState, GameView } from "../store";

const pages = {
  [GameView.HOME]: () => "/",
  [GameView.LOBBY]: (gameCode: string) => `/room/${gameCode}`,
  [GameView.PLAYER_INFO]: () => "/player"
};

export const middleware = (store: MiddlewareAPI<IStoreState>) => (next: Dispatch<IStoreState>) => <
  A extends Action
>(
  action: A
) => {
  if (isType(action, gameViewChange)) {
    const newPage = action.payload;

    if (pages[newPage] !== undefined) {
      return next(push(pages[newPage](store.getState().game.gameCode)));
    }
  }

  return next(action);
};
