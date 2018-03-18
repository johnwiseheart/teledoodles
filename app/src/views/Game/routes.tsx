import * as classNames from "classnames";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { push } from "react-router-redux";
import {
  GameMode,
  IBook,
  IGame,
  IImagePage,
  IPage,
  IPlayer,
  ITextPage,
  pageIsImagePage,
  pageIsTextPage,
  PageType
} from "teledoodles-lib";
import { addPage as addPageAction, joinGame, readyGame as readyGameAction } from "../../actions";
import { Button } from "../../components";
import { GameView, IStoreState, WebsocketStatus } from "../../store";
import { Classes, csstips, style } from '../../styles';
import { getPlayerInfo } from "../../utils";
import { Choose } from "./Choose";
import { Doodle } from "./Doodle";
import { Guess } from "./Guess";
import { Lobby } from "./Lobby";
import { Showcase } from "./Showcase";

interface IGameRouteOwnProps extends RouteComponentProps<{ gameCode: string }> {}

interface IGameRouteDispatchProps {
  joinGame: (gameCode: string) => void;
  addPage: (bookId: string, page: IPage) => void;
}

interface IGameRouteStateProps {
  game: IGame;
  websocketStatus: WebsocketStatus;
}

type GameRouteProps = IGameRouteOwnProps & IGameRouteStateProps & IGameRouteDispatchProps;

const gameClass = style(csstips.vertical, csstips.flex);

class UnconnectedGameRoute extends React.Component<GameRouteProps> {
  public componentDidMount() {
    const { match, websocketStatus } = this.props;
    // if the websocket is closed at this point, the user has
    // entered the lobby directly, so we need to start the game here
    if (websocketStatus === WebsocketStatus.CLOSED) {
      this.props.joinGame(match.params.gameCode);
    }
  }

  public render() {
    const { game } = this.props;
    if (game.gameMode === undefined) {
      return null; // maybe loading state
    }

    switch (game.gameMode) {
      case GameMode.LOBBY:
      case GameMode.LOBBY_READY:
        return <Lobby />;
      case GameMode.SHOWCASE:
        return <Showcase game={game} />;
    }

    const playerId = getPlayerInfo().id;
    const currentBook = game.players[playerId].books[0];

    if (currentBook === undefined) {
      const waitingOnPlayer = this.findNearestBookOwner();
      const username = waitingOnPlayer ? waitingOnPlayer.username : "UNKNOWN";

      return (
        <div className={Classes.flexContainer}>
          <div className={Classes.panel}>
            Waiting on {username}
          </div>
        </div>
      );
    }
    const lastPage = currentBook.pages[currentBook.pages.length - 1];

    if (currentBook.pages.length === 0) {
      return <Choose onChoose={this.handleAddTextPage} />;
    } else if (pageIsTextPage(lastPage)) {
      return <Doodle onDoodle={this.handleAddImagePage} text={lastPage.text} />;
    } else if (pageIsImagePage(lastPage)) {
      return <Guess onGuess={this.handleAddTextPage} imageId={lastPage.imageId} />;
    }

    return <div className={gameClass}>It shouldn't be possible to get here.</div>;
  }

  private handleAddTextPage = (text: string) => {
    const playerId = getPlayerInfo().id;

    const { game } = this.props;
    const currentBook = game.players[playerId].books[0];

    const page: ITextPage = {
      pageType: PageType.TEXT,
      playerId,
      text,
    };

    this.props.addPage(currentBook.id, page);
  };

  private handleAddImagePage = (imageId: string) => {
    const playerId = getPlayerInfo().id;

    const { game } = this.props;
    const currentBook = game.players[playerId].books[0];

    const page: IImagePage = {
      imageId,
      pageType: PageType.IMAGE,
      playerId,
    };

    this.props.addPage(currentBook.id, page);
  };

  private findNearestBookOwner = (): IPlayer => {
    const { game } = this.props;
    const playerId = getPlayerInfo().id;

    let playersProcessed = 0;

    let currPlayer = game.players[game.players[playerId].prev];
    while (currPlayer.books.length === 0 && playersProcessed <= Object.keys(game.players).length) {
      currPlayer = game.players[game.players[playerId].prev]
      playersProcessed += 1;
    }

    if (playersProcessed === Object.keys(game.players).length) {
      return undefined;
    }

    return currPlayer;
  }
}

const mapStateToProps = (state: IStoreState): IGameRouteStateProps => {
  return {
    game: state.game,
    websocketStatus: state.websocketStatus
  };
};

const mapDispatchToProps = (dispatch: Dispatch<IStoreState>): IGameRouteDispatchProps => {
  return {
    addPage: (bookId: string, page: IPage) => dispatch(addPageAction(bookId, page)),
    joinGame: (gameCode: string) => dispatch(joinGame(gameCode)),
  };
};

export const GameRoute = connect<IGameRouteStateProps, IGameRouteDispatchProps, IGameRouteOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedGameRoute);
