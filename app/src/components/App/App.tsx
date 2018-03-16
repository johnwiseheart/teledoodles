import * as React from 'react';
import { withRouter, RouteComponentProps, Route } from 'react-router';
import './App.scss';
import { HomeRoute } from '../Home/routes';
import { LobbyRoute } from '../Lobby/routes';
import { ChooseRoute } from '../Choose/routes';
import { connect } from 'react-redux';
import { StoreState, Page } from '../../store';
import { getPlayerInfo } from '../../util';
import { PlayerInfoRoute } from '../PlayerInfo/routes';
import { DoodleRoute } from "../Doodle/routes";

interface AppOwnProps {}

interface AppStateProps {
  page: Page;
}

interface AppDispatchProps {
}

type AppProps = AppOwnProps & AppStateProps & AppDispatchProps & RouteComponentProps<{ gameCode: string}>;

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

const mapStateToProps = (state: StoreState) => {
  return {
    page: state.page,
  };
};

export const App = withRouter(
  connect<AppStateProps, AppDispatchProps, AppOwnProps>(mapStateToProps)(UnconnectedApp)
);