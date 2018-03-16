import { WebsocketStatus, Page } from '../store';
import initialState from './initialState';
import { gameJoin, websocketMessage, websocketOpen, websocketClose, websocketConnect } from '../actions';
import { Action } from 'redux';
import { isType } from 'typescript-fsa';
import { Game } from "teledoodles-lib";

const websocketStatus = (state: string = initialState.websocketStatus, action: Action): string => {
  if (isType(action, websocketOpen)) {
    return WebsocketStatus.OPEN;
  }

  if (isType(action, websocketConnect)) {
    return WebsocketStatus.OPENING;
  }

  if (isType(action, websocketClose)) {
    return WebsocketStatus.CLOSED;
  }

  return state;
};

export default websocketStatus;