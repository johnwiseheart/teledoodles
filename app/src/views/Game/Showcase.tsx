import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { IGame, IImagePage, ITextPage, pageIsImagePage, pageIsTextPage } from 'teledoodles-lib';
import { Button, DoodleViewer, Input } from "../../components";
import { classes, Classes, csstips, style } from '../../styles';

interface IShowcaseProps {
  game: IGame;
}

export class Showcase extends React.Component<IShowcaseProps> {
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
          <div key={book.id} className={Styles.book}>
            <div className={Styles.separator}><h2>{game.players[book.id].username}'s Book</h2></div>
            {pages}
          </div>
        )
      });

    const handleLeaveGame = () => {
      document.location.href = "/";
    }


    return (
      <div className={Classes.flexContainer}>
        {books}
        <div>
          <Button text="Leave Game" onClick={handleLeaveGame} />
        </div>
      </div>
    );
  }

  public renderImagePage = (page: IImagePage) => {
    const { game } = this.props;
    return (
      <div key={page.playerId}>
        <div className={Styles.separator}>which {game.players[page.playerId].username} thought looked like</div>
        <DoodleViewer imageId={page.imageId} />
      </div>
    )
  }

  public renderTextPage = (page: ITextPage, index: number) => {
    const { game } = this.props;

    const preText = index > 0 ? <div className="separator">which {game.players[page.playerId].username} thought was</div> : undefined;

    return (
      <div key={page.playerId}>
        {preText}
        <div className={Styles.showcasePanel}>
          <h1>{page.text}</h1>
        </div>
      </div>
    )
  }
}

namespace Styles {
  export const showcasePanel = classes(style({
    alignItems: "center",
    height: "200px",
  }, csstips.flexRoot, csstips.centerJustified), Classes.panel);

  export const separator = style({
    color: "#999",
    fontSize: "12px",
    textAlign: "center",
    textTransform: "uppercase",
  }, csstips.padding(10))

  export const book = style(csstips.padding(10, 0))
}