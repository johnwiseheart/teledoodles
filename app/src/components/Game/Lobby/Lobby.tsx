import * as classNames from "classnames";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { IPlayer, IGame, GameMode } from "teledoodles-lib";
import { joinGame, readyGame as readyGameAction, startGame as startGameAction } from "../../../actions";
import { IStoreState, WebsocketStatus } from "../../../store";
import { Button } from "../../Button/Button";
import "./Lobby.scss";

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

    const readyText = isReady ? "Wait a sec" : "Ready Up";
    return (
      <div className="lobby">
        <h2>Lobby {game.gameCode}</h2>
        <p>All players must be ready to start the game.</p>
        <p>There must be atleast 4 players to start the game.</p>
        <div className="lobby-players">
          <fieldset name="Not ready">
            <legend>Not ready</legend>
            {this.renderPlayers(this.getPlayersLeft(false))}
          </fieldset>
          <fieldset name="ready">
            <legend>Ready</legend>
            {this.renderPlayers(this.getPlayersLeft(true))}
          </fieldset>
        </div>
        <Button text={readyText} selected={isReady} onClick={this.toggleReady} />
        <Button text="Start" disabled={game.gameMode !== GameMode.LOBBY_READY} onClick={startGame} />
      </div>
    );
  }

  private getPlayersLeft = (isReady: boolean) => {
    const { players } = this.props;

    return Object.keys(players)
      .map(key => players[key])
      .filter(player => player.isReady === isReady);
  };

  private renderPlayers = (players: IPlayer[]) => {
    return Object.keys(players)
      .map(key => players[key])
      .map(player => {
        const className = classNames("player", {
          "not-ready": !player.isReady,
          ready: player.isReady
        });
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

const mapStateToProps = (state: IStoreState): ILobbyRouteStateProps => {
  return {
    game: state.game,
    players: state.game.players,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<IStoreState>): ILobbyRouteDispatchProps => {
  return {
    readyGame: (isReady: boolean) => dispatch(readyGameAction(isReady)),
    startGame: () => dispatch(startGameAction())
  };
};

export const Lobby = connect<
  ILobbyRouteStateProps,
  ILobbyRouteDispatchProps,
  {}
>(mapStateToProps, mapDispatchToProps)(UnconnectedLobbyRoute);
