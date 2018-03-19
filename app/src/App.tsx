import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { Route, RouteComponentProps, withRouter } from "react-router";
import { push } from "react-router-redux";
import { cssRule } from "typestyle";
import { joinGame } from "./actions";
import { IStoreState, WebsocketStatus } from "./store";
import { Classes, color, Colors, csstips, Shadows, style } from "./styles";
import { getPlayerInfo } from "./utils";
import { GameRoute } from "./views/Game/routes";
import { HomeRoute } from "./views/Home/routes";
import { PlayerInfoRoute } from "./views/PlayerInfo/routes";
csstips.normalize();
csstips.setupPage("#root");

cssRule("body", {
  height: "inherit",
});

cssRule("html", {
  backgroundColor: "#eee",
});

cssRule("#root", {
  display: "flex",
  justifyContent: "center",
});

export interface IAppOwnProps extends RouteComponentProps<{ gameCode: string }> {}

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
      <div className={Styles.app}>
        <header className={Styles.header}>Teledoodles</header>
        <div className={Classes.flexContainer}>
          <Route exact={true} path="/" component={HomeRoute} />
          <Route path="/game/:gameCode" component={GameRoute} />
          <Route exact={true} path="/player" component={PlayerInfoRoute} />
        </div>
      </div>
    );
  }
}

namespace Styles {
  export const app = style(
    {
      maxWidth: "500px",
    },
    csstips.flex,
    csstips.vertical,
    csstips.margin(10),
  );

  export const header = style(
    {
      backgroundColor: Colors.primary,
      boxShadow: Shadows.one,
      color: Colors.primaryText,
      fontSize: "30px",
      textAlign: "center",
    },
    csstips.padding(10),
    csstips.margin(0, 0, 10, 0),
  );
}

const mapStateToProps = (state: IStoreState): IAppStateProps => {
  return {
    websocketStatus: state.websocketStatus,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<IStoreState>): IAppDispatchProps => {
  return {
    redirectToPlayerInfo: () => dispatch(push("/player")),
  };
};

export const App = withRouter(
  connect<IAppStateProps, IAppDispatchProps, IAppOwnProps>(mapStateToProps, mapDispatchToProps)(
    UnconnectedApp,
  ),
);
