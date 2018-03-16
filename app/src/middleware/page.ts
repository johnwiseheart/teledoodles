import { push } from "react-router-redux";
import { Dispatch } from "redux";
import { Action } from "redux";
import { Middleware, MiddlewareAPI } from "redux";
import { isType } from "typescript-fsa";
import {
    pageChange,
} from "../actions";
import { IStoreState, Page } from "../store";

const pages = {
    [Page.HOME]: () => "/",
    [Page.LOBBY]: (gameCode: string) => `/room/${gameCode}`,
};

export const middleware =
    (store: MiddlewareAPI<IStoreState>) => (next: Dispatch<IStoreState>) =>
    <A extends Action>(action: A) => {
        if (isType(action, pageChange)) {
            const newPage = action.payload;

            if (pages[newPage] !== undefined) {
                return next(push(pages[newPage](store.getState().game.gameCode)));
            }

        }

        return next(action);
    };
