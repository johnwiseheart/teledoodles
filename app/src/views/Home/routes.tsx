import { rgba } from "csx";
import * as React from "react";
import ReactDOM = require('react-dom');
import { connect, Dispatch } from "react-redux";
import { joinGame as joinGameAction, newGame as newGameAction } from "../../actions";
import { Button, Input } from "../../components";
import { IStoreState } from "../../store";
import { Classes, classes, Colors, csstips, Shadows, style } from "../../styles";

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

  private panel: HTMLDivElement;
  private refHandlers = {
    panel: (panel: HTMLDivElement) => {
      this.panel = panel;
    }
  }

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
        <div className={Classes.buttonGroupVertical}>
          <Button text="Create" onClick={newGame} />
          <Button text="Join" onClick={this.toggleOverlay} />
        </div>
      </div>
    );
  }

  private renderJoinCodeOverlay = () => {
    const { gameCode } = this.state;

    return (
      <div className={Styles.overlay} onClick={this.handleClickOverlay}>
        <div ref={this.refHandlers.panel} className={Styles.overlayPanel}>
          <Input value={gameCode} placeholder="Game code" onChange={this.handleGameCodeChange} autoFocus={true} />
          <div className={Classes.buttonGroup}>
            <Button text="Cancel" onClick={this.toggleOverlay} />
            <Button text="Submit" disabled={gameCode.length !== 4} onClick={this.handleSubmitGameCode} />
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

  private handleClickOverlay = (event: React.MouseEvent<HTMLDivElement>) => {
    if (this.panel != null && !this.panel.contains(event.target as Node)) {
      const { isOverlayOpen } = this.state;
      this.setState({ isOverlayOpen: !isOverlayOpen });
    }
  }

  private toggleOverlay = () => {
    const { isOverlayOpen } = this.state;
    this.setState({ isOverlayOpen: !isOverlayOpen });
  };
}

namespace Styles {
  export const overlay = style(
    {
      backgroundColor: rgba(0, 0, 0, 0.6).toString(),
      bottom: 0,
      left: 0,
      position: "absolute",
      right: 0,
      top: 0,
    },
    csstips.center,
    csstips.flexRoot,
    csstips.centerJustified,
  );

  export const overlayPanel = classes(
    style(
      {
        backgroundColor: Colors.background,
        boxShadow: Shadows.one,
        maxWidth: "500px",
      },
      csstips.flex,
      csstips.padding(10, 10, 5, 10),
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
