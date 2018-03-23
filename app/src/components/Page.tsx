import * as classNames from "classnames";
import * as React from "react";
import { IGame, IImagePage, IPage, ITextPage, pageIsImagePage, pageIsTextPage } from 'teledoodles-lib';
import { classes, Classes, color, Colors, csstips, Shadows, style } from "../styles";
import { S3ImageWrapper } from './S3ImageWrapper';

export interface IButtonProps {
  game: IGame;
  page: IPage;
}

export const Page = ({ game, page }: IButtonProps) => {
  return (
    <div className={Styles.container} key={page.playerId}>
      <div className={Styles.header}>{game.players[page.playerId].username}</div>
      <div className={Styles.content}>
        {renderPageItem(page)}
      </div>
    </div>
  );
};

const renderPageItem = (page: IPage) => {
  if (pageIsImagePage(page)) {
    const renderImage = (imageUrl: string) => <img className={Styles.image} src={imageUrl} />;
    return <S3ImageWrapper imageId={page.imageId} renderImage={renderImage} />;
  } else if (pageIsTextPage(page)) {
    return <div className={Styles.text}><h1>{page.text}</h1></div>;
  }
}

namespace Styles {
  export const container = style({
    border: `3px solid ${Colors.primary}`,
    boxShadow: Shadows.one,
  }, csstips.margin(10, 0))

  export const header = style({
    backgroundColor: Colors.primary,
    color: Colors.white,
    fontSize: "18px",
    fontWeight: 600,
    textAlign: "center",
    textTransform: "uppercase",
  }, csstips.padding(5, 0))

  export const content = style({
    backgroundColor: Colors.white,
  })

  export const image = style({
    width: "100%",
  })

  export const text = style({
    height: "150px",
  }, csstips.flexRoot, csstips.centerCenter)
}
