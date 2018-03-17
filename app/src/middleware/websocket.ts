import { Dispatch } from "redux";
import { Action } from "redux";
import { MiddlewareAPI } from "redux";
import { Middleware } from "redux";
import { isType } from "typescript-fsa";
import {
  websocketClose,
  websocketConnect,
  websocketDisconnect,
  websocketMessage,
  websocketOpen,
  websocketSend
} from "../actions";

let websocket: WebSocket;

export const middleware: Middleware = (store: MiddlewareAPI<void>) => (next: Dispatch<void>) => <
  A extends Action
>(
  action: A
) => {
  if (isType(action, websocketConnect)) {
    // Configure the object
    websocket = new WebSocket("ws://localhost:5000/ws");

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
