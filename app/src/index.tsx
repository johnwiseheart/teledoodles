import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/App/App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose, Middleware } from 'redux';
import './index.scss';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import initialState from './reducers/initialState';
import game from './reducers/game';
import thunk from 'redux-thunk';
import { middleware as websocket } from './middleware/websocket';
import { middleware as page } from './middleware/page';
import websocketReducer from "./reducers/websocketStatus";
import pageReducer from "./reducers/page";

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history);

// tslint:disable-next-line
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({
    game,
    router: routerReducer,
    websocketStatus: websocketReducer,
    page: pageReducer,
  }),

  initialState,
  composeEnhancers(
    applyMiddleware(page as Middleware, websocket, thunk, middleware),
  )
);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();