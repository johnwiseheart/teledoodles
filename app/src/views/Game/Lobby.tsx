import * as classNames from "classnames";
import * as csstips from "csstips";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { GameMode, IGame, IPlayer } from "teledoodles-lib";
import {
  joinGame,
  readyGame as readyGameAction,
  startGame as startGameAction,
} from "../../actions";
import { Button } from "../../components";
import { EmptyPlayerCard } from '../../components/EmptyPlayerCard';
import { PlayerCard } from '../../components/PlayerCard';
import { Intent } from '../../components/utils';
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
    isReady: false,
  };

  public render() {
    // TODO: loading until websocket connected
    const { isReady } = this.state;
    const { game, startGame } = this.props;

    const readyText = isReady ? "Ready" : "Not Ready";
    const intent = isReady ? Intent.SUCCESS : Intent.DANGER;
    return (
      <div className={Classes.flexContainer}>
        <div className={Classes.subheader}>Players</div>
        <div className={classes(Styles.players)}>{this.renderPlayers()}</div>
        <div className={Classes.flexPad} />
        <div className={Classes.buttonGroupVertical}>
          <Button intent={intent} text={readyText} onClick={this.toggleReady} />
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
    const renderPlayers = Object.keys(players)
      .map(key => players[key])
      .map(player => <PlayerCard key={player.id} player={player} />);

    const numEmptyPlayers = 4 - Object.keys(players).length;
    const renderEmptyPlayers = numEmptyPlayers > 0 ?
      Array.from(Array(numEmptyPlayers).keys()).map((index: number) => <EmptyPlayerCard key={index} />) : undefined;

    return [...renderPlayers, renderEmptyPlayers]
  };

  private toggleReady = () => {
    const { isReady } = this.state;
    const { readyGame } = this.props;
    this.setState({ isReady: !isReady });
    readyGame(!isReady);
  };
}

namespace Styles {
  export const players = style(csstips.verticallySpaced(10));
}

const mapStateToProps = (state: IStoreState): ILobbyRouteStateProps => {
  return {
    game: state.game,
    players: state.game.players,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<IStoreState>): ILobbyRouteDispatchProps => {
  return {
    readyGame: (isReady: boolean) => dispatch(readyGameAction(isReady)),
    startGame: () => dispatch(startGameAction()),
  };
};

export const Lobby = connect<ILobbyRouteStateProps, ILobbyRouteDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps,
)(UnconnectedLobbyRoute);
