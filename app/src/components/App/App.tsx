import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { Route, RouteComponentProps, withRouter } from "react-router";
import { IStoreState, GameView, WebsocketStatus } from "../../store";
import { getPlayerInfo } from "../../util";
import { HomeRoute } from "../Home/routes";
import { PlayerInfoRoute } from "../PlayerInfo/routes";
import "./App.scss";
import { DebugScreen } from '../DebugScreen/DebugScreen';
import { changeGameView, joinGame } from '../../actions';
import { GameRoute } from '../Game/routes';

export interface IAppOwnProps extends RouteComponentProps<{ gameCode: string }> { };

export interface IAppStateProps {
  websocketStatus: WebsocketStatus;
}

export interface IAppDispatchProps {
  redirectToPlayerInfo: () => void;
}

type AppProps = IAppStateProps & IAppDispatchProps & IAppOwnProps;

class UnconnectedApp extends React.Component<AppProps, {}> {

  public componentDidMount() {
    if (getPlayerInfo() == null) {
      this.props.redirectToPlayerInfo();
    }
  }

  public render() {
    return (
      <div className="app">
        <div className="body">
          <div className="body-inner">
            {/* {this.getRoute()} */}
            <Route exact={true} path="/" component={HomeRoute} />
            <Route path="/game/:gameCode" component={GameRoute} />
            <Route exact={true} path="/debug" component={DebugScreen} />
            <Route exact={true} path="/player" component={PlayerInfoRoute}/>
            {/* <Route path="/guess" component={GuessRoute}/> */}
            {/* <Route path="/choose" component={ChooseRoute}/> */}

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IStoreState): IAppStateProps => {
  return {
    websocketStatus: state.websocketStatus
  };
};

const mapDispatchToProps = (dispatch: Dispatch<IStoreState>): IAppDispatchProps => {
  return {
    redirectToPlayerInfo: () => dispatch(changeGameView(GameView.PLAYER_INFO)),
  };
};

export const App = withRouter(connect<IAppStateProps, IAppDispatchProps, IAppOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedApp));