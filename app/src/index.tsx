import createHistory from "history/createBrowserHistory";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter, routerMiddleware, routerReducer } from "react-router-redux";
import { applyMiddleware, combineReducers, compose, createStore, Middleware } from "redux";
import thunk from "redux-thunk";
import { App } from "./components/App/App";
import "./index.scss";
import { middleware as page } from "./middleware/page";
import { middleware as websocket } from "./middleware/websocket";
import game from "./reducers/game";
import initialState from "./reducers/initialState";
import pageReducer from "./reducers/page";
import websocketReducer from "./reducers/websocketStatus";
import registerServiceWorker from "./registerServiceWorker";

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history);

// tslint:disable-next-line
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({
    game,
    page: pageReducer,
    router: routerReducer,
    websocketStatus: websocketReducer
  }),

  initialState,
  composeEnhancers(applyMiddleware(page as Middleware, websocket, thunk, middleware))
);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
