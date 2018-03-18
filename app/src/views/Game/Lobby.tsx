import * as classNames from "classnames";
import * as csstips from "csstips";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { GameMode, IGame, IPlayer } from "teledoodles-lib";
import {
  joinGame,
  readyGame as readyGameAction,
  startGame as startGameAction
} from "../../actions";
import { Button } from "../../components";
import { IStoreState, WebsocketStatus } from "../../store";
import { Classes, classes, style } from "../../styles";
import { getPlayerInfo } from "../../utils";

interface ILobbyRouteStateProps {
  game: IGame;
  players: { [id: string]: IPlayer };
}

interface ILobbyRouteDispatchProps {
  readyGame: (isReady: boolean) => void;
  startGame: () => void;
}

type LobbyRouteProps = ILobbyRouteStateProps & ILobbyRouteDispatchProps;

interface ILobbyRouteState {
  isReady: boolean;
}

class UnconnectedLobbyRoute extends React.Component<LobbyRouteProps, ILobbyRouteState> {
  public state: ILobbyRouteState = {
    isReady: false
  };

  public render() {
    // TODO: loading until websocket connected
    const { isReady } = this.state;
    const { game, startGame } = this.props;

    const readyText = isReady ? "Un-Ready" : "Ready Up";
    return (
      <div className={Classes.flexContainer}>
        <div className={classes(Classes.panel)}>
          <h2>Lobby {game.gameCode}</h2>
          <p>At least 4 players must be ready for the host to start the game.</p>
        </div>
        <div className={classes(Classes.panel, Styles.players)}>{this.renderPlayers()}</div>
        <div className={Classes.flexPad} />
        <div>
          <Button text={readyText} selected={isReady} onClick={this.toggleReady} />
          {this.maybeRenderStartButton()}
        </div>
      </div>
    );
  }

  private maybeRenderStartButton = () => {
    const { game, startGame } = this.props;
    const playerId = getPlayerInfo().id;
    if (playerId !== game.host) {
      return undefined;
    }
    return (
      <Button text="Start" disabled={game.gameMode !== GameMode.LOBBY_READY} onClick={startGame} />
    );
  };

  private renderPlayers = () => {
    const { players } = this.props;
    return Object.keys(players)
      .map(key => players[key])
      .map(player => {
        const className = player.isReady ? Styles.playerReady : Styles.playerNotReady;
        return (
          <div key={player.id} className={className}>
            {player.username}
          </div>
        );
      });
  };

  private toggleReady = () => {
    const { isReady } = this.state;
    const { readyGame } = this.props;
    this.setState({ isReady: !isReady });
    readyGame(!isReady);
  };
}

namespace Styles {
  export const players = style(csstips.verticallySpaced(5));

  export const playerReady = style({
    border: "1px solid green"
  });

  export const playerNotReady = style({
    border: "1px solid red"
  });
}

const mapStateToProps = (state: IStoreState): ILobbyRouteStateProps => {
  return {
    game: state.game,
    players: state.game.players
  };
};

const mapDispatchToProps = (dispatch: Dispatch<IStoreState>): ILobbyRouteDispatchProps => {
  return {
    readyGame: (isReady: boolean) => dispatch(readyGameAction(isReady)),
    startGame: () => dispatch(startGameAction())
  };
};

export const Lobby = connect<ILobbyRouteStateProps, ILobbyRouteDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedLobbyRoute);
