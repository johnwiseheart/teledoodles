import { Action, Dispatch, Middleware, MiddlewareAPI } from "redux";
import { isType } from "typescript-fsa";
import {
  websocketClose,
  websocketConnect,
  websocketDisconnect,
  websocketMessage,
  websocketOpen,
  websocketSend,
} from "../actions";
import { SERVER_URL } from '../config';

let websocket: WebSocket;

export const middleware: Middleware = (store: MiddlewareAPI<void>) => (next: Dispatch<void>) => <
  A extends Action
>(
  action: A,
) => {
  if (isType(action, websocketConnect)) {
    // Configure the object
    websocket = new WebSocket("ws://" + SERVER_URL + "/ws");

    // Attach the callbacks
    websocket.onopen = () => {
      store.dispatch(websocketOpen());

      if (action.payload.messages) {
        action.payload.messages.forEach(element => {
          store.dispatch(websocketSend(element));
        });
      }
    };
    websocket.onclose = event => store.dispatch(websocketClose({ event }));
    websocket.onmessage = event => {
      store.dispatch(websocketMessage({ event }));
    };
  }

  if (isType(action, websocketSend)) {
    websocket.send(JSON.stringify(action.payload));
  }

  if (isType(action, websocketDisconnect)) {
    websocket.close();
  }

  return next(action);
};
