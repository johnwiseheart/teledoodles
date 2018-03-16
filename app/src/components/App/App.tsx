import * as React from "react";
import { connect } from "react-redux";
import { Route, RouteComponentProps, withRouter } from "react-router";
import { IStoreState, Page } from "../../store";
import { getPlayerInfo } from "../../util";
import { ChooseRoute } from "../Choose/routes";
import { DoodleRoute } from "../Doodle/routes";
import { HomeRoute } from "../Home/routes";
import { LobbyRoute } from "../Lobby/routes";
import { PlayerInfoRoute } from "../PlayerInfo/routes";
import "./App.scss";

interface IAppOwnProps {}

interface IAppStateProps {
  page: Page;
}

interface IAppDispatchProps {}

type AppProps = IAppOwnProps & IAppStateProps & IAppDispatchProps & RouteComponentProps<{ gameCode: string}>;

class UnconnectedApp extends React.Component<AppProps, {}> {
  public render() {
    return (
      <div className="app">
        <div className="body">
            <div className="body-inner">
              {/* {this.getRoute()} */}
              <Route exact={true} path="/" component={HomeRoute}/>
              <Route path="/room/:gameCode" component={LobbyRoute}/>
              <Route exact={true} path="/doodle" component={DoodleRoute}/>
              {/* <Route path="/guess" component={GuessRoute}/>
              <Route path="/choose" component={ChooseRoute}/>
              <Route path="/player" component={PlayerInfoRoute}/> */}
            </div>
        </div>
      </div>
    );
  }

  // public getRoute = () => {
  //   const { page, match, location, history } = this.props;
  //   if (getPlayerInfo() == null) {
  //     return <PlayerInfoRoute />;
  //   }

  //   switch (page) {
  //       case Page.LOBBY:
  //           return <LobbyRoute match={match} location={location} history={history} />;
  //       case Page.CHOOSE_WORD:
  //           return <ChooseRoute />;
  //       default:
  //           return <HomeRoute />;
  //   }
  // }
}

const mapStateToProps = (state: IStoreState) => {
  return {
    page: state.page,
  };
};

export const App = withRouter(
  connect<IAppStateProps, IAppDispatchProps, IAppOwnProps>(mapStateToProps)(UnconnectedApp),
);
