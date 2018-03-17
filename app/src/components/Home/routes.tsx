import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { joinGame as joinGameAction, newGame as newGameAction } from "../../actions";
import { IStoreState } from "../../store";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import "./Home.scss";

export interface IHomeRouteDispatchProps {
  joinGame: (gameCode: string) => void;
  newGame: () => void;
}

export type HomeRouteProps = IHomeRouteDispatchProps;

interface IHomeRouteState {
  isOverlayOpen: boolean;
  gameCode: string;
}

class UnconnectedHomeRoute extends React.Component<HomeRouteProps, IHomeRouteState> {
  public state: IHomeRouteState = {
    gameCode: "",
    isOverlayOpen: false
  };

  public render() {
    const { isOverlayOpen } = this.state;
    const { newGame } = this.props;

    const playerInfo = localStorage.getItem("player");
    const playerName = playerInfo != null ? JSON.parse(playerInfo).username : undefined;

    return (
      <div className="home">
        {isOverlayOpen && this.renderJoinCodeOverlay()}
        <header>Teledoodles</header>
        <div className="panel">
          <h2>Welcome {playerName}</h2>
        </div>
        <div className="panel">
          <p>
            Teledoodles is an implementation of the telephone game (also known also as chinese
            whispers).
          </p>
          <p>
            Instead of whispering, teledoodles players use their mobile devices to draw doodles{" "}
            describing the words.
          </p>
        </div>
        <div className="flex-pad" />
        <Button text="Create" onClick={newGame} />
        <Button text="Join" onClick={this.toggleOverlay} />
      </div>
    );
  }

  private renderJoinCodeOverlay = () => {
    const { gameCode } = this.state;

    return (
      <div className="overlay">
        <div className="panel">
          Enter your game code
          <Input value={gameCode} onChange={this.handleGameCodeChange} autoFocus={true} />
          <div className="buttons">
            <Button text="Cancel" onClick={this.toggleOverlay} />
            <Button text="Submit" onClick={this.handleSubmitGameCode} />
          </div>
        </div>
      </div>
    );
  };

  private handleGameCodeChange = (gameCode: string) => {
    this.setState({ gameCode: gameCode.slice(0, 4) });
  };

  private handleSubmitGameCode = () => {
    const { gameCode } = this.state;
    if (gameCode.length > 0) {
      this.props.joinGame(gameCode);
    }
  };

  private toggleOverlay = () => {
    const { isOverlayOpen } = this.state;
    this.setState({ isOverlayOpen: !isOverlayOpen });
  };
}

const mapStateToProps = (state: IStoreState): {} => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch<IStoreState>): IHomeRouteDispatchProps => {
  return {
    joinGame: (gameCode: string) => dispatch(joinGameAction(gameCode)),
    newGame: () => dispatch(newGameAction())
  };
};

export const HomeRoute = connect<{}, IHomeRouteDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedHomeRoute);
