import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Button } from "../../Button/Button";
import DoodleViewer from "../../DoodleViewer/DoodleViewer";
import { Input } from "../../Input/Input";
import "./Showcase.scss";
import { IGame, ITextPage, IImagePage, pageIsImagePage, pageIsTextPage } from 'teledoodles-lib';

interface IShowcaseProps {
  game: IGame;
}

interface IShowcaseState {
}

export class Showcase extends React.Component<IShowcaseProps, IShowcaseState> {
  public render() {
    const { game } = this.props;

    const books = Object.keys(game.books)
      .map(key => game.books[key])
      .map(book => {
        const pages = book.pages.map((page, index) => {
          if (pageIsImagePage(page)) {
            return this.renderImagePage(page)
          } else if (pageIsTextPage(page)) {
            return this.renderTextPage(page, index);
          }
        })

        return (
          <div key={book.id} className="book">
            <div className="separator"><h2>{game.players[book.id].username}'s Book</h2></div>
            {pages}
          </div>
        )
      });

    const handleLeaveGame = () => {
      document.location.href = "/";
    }


    return (
      <div className="showcase">
        {books}
        <Button text="Leave Game" onClick={handleLeaveGame} />
      </div>
    );
  }

  public renderImagePage = (page: IImagePage) => {
    const { game } = this.props;
    return (
      <div key={page.playerId}>
        <div className="separator">which {game.players[page.playerId].username} thought looked like</div>
        <DoodleViewer imageId={page.imageId} />
      </div>
    )
  }

  public renderTextPage = (page: ITextPage, index: number) => {
    const { game } = this.props;

    const preText = index > 0 ? <div className="separator">which {game.players[page.playerId].username} thought was a...</div> : undefined;

    return (
      <div key={page.playerId}>
        {preText}
        <div className="panel">
          <h1>{page.text}</h1>
        </div>
      </div>
    )
  }
}
