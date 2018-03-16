import { Dispatch } from 'redux';
import {
    pageChange,
} from '../actions';
import { Action } from 'redux';
import { isType } from 'typescript-fsa';
import { Middleware, MiddlewareAPI } from 'redux';
import { push } from 'react-router-redux';
import { Page, StoreState } from "../store";

const pages = {
    [Page.HOME]: () => '/',
    [Page.LOBBY]: (gameCode: string) => `/room/${gameCode}`
}


export const middleware =
    (store: MiddlewareAPI<StoreState>) => (next: Dispatch<StoreState>) =>
    <A extends Action>(action: A) => {
        if (isType(action, pageChange)) {
            const newPage = action.payload;

            if(pages[newPage] !== undefined) {
                return next(push(pages[newPage](store.getState().game.gameCode)))
            }

        }

        return next(action);
    };