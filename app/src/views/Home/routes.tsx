import { rgba } from "csx";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { joinGame as joinGameAction, newGame as newGameAction } from "../../actions";
import { Button, Input } from "../../components";
import { IStoreState } from "../../store";
import { Classes, classes, csstips, style } from "../../styles";

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
    isOverlayOpen: false,
  };

  public render() {
    const { isOverlayOpen } = this.state;
    const { newGame } = this.props;

    const playerInfo = localStorage.getItem("player");
    const playerName = playerInfo != null ? JSON.parse(playerInfo).username : undefined;

    return (
      <div className={Classes.flexContainer}>
        {isOverlayOpen && this.renderJoinCodeOverlay()}
        <div className={Classes.panel}>
          <h2>Welcome {playerName}</h2>
        </div>
        <div className={Classes.panel}>
          <p>
            Teledoodles is an implementation of the telephone game (also known also as chinese
            whispers).
          </p>
          <p>
            Instead of whispering, teledoodles players use their mobile devices to draw doodles{" "}
            describing the words.
          </p>
        </div>
        <div className={Classes.flexPad} />
        <div>
          <Button text="Create" onClick={newGame} />
          <Button text="Join" onClick={this.toggleOverlay} />
        </div>
      </div>
    );
  }

  private renderJoinCodeOverlay = () => {
    const { gameCode } = this.state;

    return (
      <div className={Styles.overlay}>
        <div className={Styles.overlayPanel}>
          Enter your game code
          <Input value={gameCode} onChange={this.handleGameCodeChange} autoFocus={true} />
          <div className={style(csstips.flexRoot)}>
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

namespace Styles {
  export const overlay = style(
    {
      alignItems: "center",
      backgroundColor: rgba(0, 0, 0, 0.6).toString(),
      bottom: 0,
      left: 0,
      position: "absolute",
      right: 0,
      top: 0,
    },
    csstips.flexRoot,
    csstips.centerJustified,
  );

  export const overlayPanel = classes(
    style(
      {
        maxWidth: "500px",
      },
      csstips.flex,
      csstips.padding(10),
    ),
    Classes.panel,
  );
}

const mapStateToProps = (state: IStoreState): {} => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch<IStoreState>): IHomeRouteDispatchProps => {
  return {
    joinGame: (gameCode: string) => dispatch(joinGameAction(gameCode)),
    newGame: () => dispatch(newGameAction()),
  };
};

export const HomeRoute = connect<{}, IHomeRouteDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps,
)(UnconnectedHomeRoute);
