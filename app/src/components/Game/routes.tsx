import * as classNames from "classnames";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { IPlayer } from "teledoodles-lib";
import { joinGame, readyGame as readyGameAction } from "../../actions";
import { IStoreState, WebsocketStatus, GameView } from "../../store";
import { Button } from "../Button/Button";
import { Guess } from './Guess/Guess';
import { Choose } from './Choose/Choose';
import { Doodle } from './Doodle/Doodle';
import { Lobby } from './Lobby/Lobby';

interface IGameRouteOwnProps extends RouteComponentProps<{ gameCode: string }> {}

interface IGameRouteDispatchProps {
  joinGame: (gameCode: string) => void;
}

interface IGameRouteStateProps {
  gameView: GameView;
  websocketStatus: WebsocketStatus;
}

type GameRouteProps = IGameRouteOwnProps & IGameRouteStateProps & IGameRouteDispatchProps;

class UnconnectedGameRoute extends React.Component<GameRouteProps> {

  componentDidMount() {
    const { match, websocketStatus } = this.props;
    // if the websocket is closed at this point, the user has
    // entered the lobby directly, so we need to start the game here
    if (websocketStatus === WebsocketStatus.CLOSED) {
      console.log(match.params.gameCode)
      this.props.joinGame(match.params.gameCode);
    }
  }

  public render() {
    switch (this.props.gameView) {
      case GameView.HOME:
      case GameView.LOBBY: return <Lobby />;
      case GameView.CHOOSE_WORD: return <Choose />
      case GameView.DOODLE_WORD: return <Doodle />
      case GameView.GUESS_DOODLE: return <Guess />
    }

    return (
      <div className="game">
        It shouldn't be possible to get here.
      </div>
    );
  }
}

const mapStateToProps = (state: IStoreState): IGameRouteStateProps => {
  return {
    gameView: state.gameView,
    websocketStatus: state.websocketStatus
  };
};

const mapDispatchToProps = (dispatch: Dispatch<IStoreState>):  IGameRouteDispatchProps => {
  return {
    joinGame: (gameCode: string) => dispatch(joinGame(gameCode)),
  };
};


export const GameRoute = connect<
  IGameRouteStateProps,
  IGameRouteDispatchProps,
  IGameRouteOwnProps
>(mapStateToProps, mapDispatchToProps)(UnconnectedGameRoute);