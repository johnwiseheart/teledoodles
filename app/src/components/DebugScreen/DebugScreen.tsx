import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { joinGame as joinGameAction, newGame as newGameAction, readyGame, startGame } from "../../actions";
import { IStoreState } from "../../store";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";

export interface IDebugScreenStateProps {
  game: string;
}

export interface IDebugScreenDispatchProps {
  joinGame: () => void;
  newGame: () => void;
  readyGame: () => void;
  startGame: () => void;
}

export type HomeRouteProps = IDebugScreenStateProps & IDebugScreenDispatchProps;

class UnconnectedDebugScreen extends React.Component<HomeRouteProps, {}> {

  public render() {
    const { joinGame, newGame, readyGame, game, startGame } = this.props;

    const playerInfo = localStorage.getItem("player");
    const playerName = playerInfo != null ? JSON.parse(playerInfo).username : undefined;

    return (
      <div>
        <header>DEBUGGING</header>
        <div className="panel">
                Username: {playerName}
        </div>
        <Button text="Create Game" onClick={newGame} />
        <Button text="Join Game (AAAA)" onClick={joinGame} />
        {game && <Button text="Ready Game (AAAA)" onClick={readyGame} />}
        {game && <Button text="Start Game (AAAA)" onClick={startGame} />}
      </div>
    );
  }
}

const mapStateToProps = (state: IStoreState): IDebugScreenStateProps => {
  return {
    game: state.game.gameCode
  };
};

const mapDispatchToProps = (dispatch: Dispatch<IStoreState>): IDebugScreenDispatchProps => {
  return {
    joinGame: () => dispatch(joinGameAction("AAAA")),
    newGame: () => dispatch(newGameAction()),
    readyGame: () => dispatch(readyGame(true)),
    startGame: () => dispatch(startGame()),
  };
};

export const DebugScreen = connect<IDebugScreenStateProps, IDebugScreenDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedDebugScreen);
