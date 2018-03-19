// tslint:disable-next-line
import createHistory from "history/createBrowserHistory";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter, routerMiddleware, routerReducer } from "react-router-redux";
import { applyMiddleware, combineReducers, compose, createStore, Middleware } from "redux";
import thunk from "redux-thunk";
import { App } from "./App";
import { middleware as websocket } from "./middleware/websocket";
import errorReducer from "./reducers/error";
import gameReducer from "./reducers/game";
import initialState from "./reducers/initialState";
import websocketReducer from "./reducers/websocketStatus";

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history);

// tslint:disable-next-line
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({
    errors: errorReducer,
    game: gameReducer,
    router: routerReducer,
    websocketStatus: websocketReducer,
  }),

  initialState,
  composeEnhancers(applyMiddleware(websocket, thunk, middleware)),
);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root") as HTMLElement,
);
