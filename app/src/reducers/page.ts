import { WebsocketStatus, Page } from '../store';
import initialState from './initialState';
import { gameJoin, websocketMessage, websocketOpen, websocketClose, websocketConnect, pageChange } from '../actions';
import { Action } from 'redux';
import { isType } from 'typescript-fsa';
import { Game } from "teledoodles-lib";

const page = (state: Page = initialState.page, action: Action): Page => {
  if (isType(action, pageChange)) {
    return action.payload;
  }

  return state;
};

export default page;