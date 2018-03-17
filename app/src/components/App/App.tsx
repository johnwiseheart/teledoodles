import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { Route, RouteComponentProps, withRouter } from "react-router";
import { IStoreState, GameView } from "../../store";
import { getPlayerInfo } from "../../util";
import { ChooseRoute } from "../Choose/routes";
import { DoodleRoute } from "../Doodle/routes";
import { HomeRoute } from "../Home/routes";
import { LobbyRoute } from "../Lobby/routes";
import { PlayerInfoRoute } from "../PlayerInfo/routes";
import "./App.scss";
import { DebugScreen } from '../DebugScreen/DebugScreen';
import { changeGameView } from '../../actions';

export interface IAppDispatchProps {
  redirectToPlayerInfo: () => void;
}

type AppProps = IAppDispatchProps & RouteComponentProps<{}>;

class UnconnectedApp extends React.Component<AppProps, {}> {

  public componentDidMount() {
    console.log(getPlayerInfo())
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
            <Route path="/room/:gameCode" component={LobbyRoute} />
            <Route exact={true} path="/doodle" component={DoodleRoute} />
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

const mapStateToProps = (state: IStoreState): {} => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch<IStoreState>): IAppDispatchProps => {
  return {
    redirectToPlayerInfo: () => dispatch(changeGameView(GameView.PLAYER_INFO)),
  };
};

export const App = withRouter(connect<{}, IAppDispatchProps, {}>(
  undefined,
  mapDispatchToProps
)(UnconnectedApp));