import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { IGame, IImagePage, ITextPage, pageIsImagePage, pageIsTextPage } from "teledoodles-lib";
import { Button, Input } from "../../components";
import { Page } from '../../components/Page';
import { classes, Classes, csstips, style } from "../../styles";

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
          return (
            <div key={page.playerId}>
              <Page game={game} page={page} />
              {index !== book.pages.length - 1 && <div className={Styles.arrow}>&#8595;</div>}
            </div>
          )
        });

        return (
          <div key={book.id} className={Styles.book}>
            <div className={Styles.separator}>
              <h2>{game.players[book.id].username}'s Book</h2>
            </div>
            {pages}
          </div>
        );
      });

    const handleLeaveGame = () => {
      document.location.href = "/";
    };

    return (
      <div className={Classes.flexContainer}>
        {books}
        <div>
          <Button text="Leave Game" onClick={handleLeaveGame} />
        </div>
      </div>
    );
  }
}

namespace Styles {
  export const arrow = style({
    color: "#999",
    textAlign: "center",
  })

  export const separator = style(
    {
      color: "#999",
      fontSize: "12px",
      textAlign: "center",
      textTransform: "uppercase",
    },
    csstips.padding(10),
  );

  export const book = style(csstips.padding(10, 0));
}
