import * as classNames from "classnames";
import { quote } from 'csx';
import * as React from "react";
import { IPlayer } from 'teledoodles-lib';
import { S3ImageWrapper } from '.';
import { classes, Classes, color, Colors, csstips, Shadows, style } from "../styles";
import { Intent } from './utils';

export interface IPlayerCardProps {
  player: IPlayer;
}

export const PlayerCard = ({ player }: IPlayerCardProps) => {
  const renderImage = (imgSrc: string) => {
    return <img className={Styles.image} src={imgSrc} />;
  };

  const renderLoader = () => {
    return <div className={Styles.image} />
  };

  return (
    <div className={classes(Classes.panel, Styles.player(player.isReady))}>
      <S3ImageWrapper imageId={player.avatarFileId} renderLoader={renderLoader} renderImage={renderImage} />
      <div className={Styles.username}>{player.username}</div>
    </div>
  );
};

namespace Styles {
  export const player = (isReady: boolean) => style({
    $nest: {
      "&::before": {
        backgroundColor: isReady ? Colors.green : Colors.red,
        bottom: 0,
        content: quote(""),
        height: "100%",
        left: 0,
        position: "absolute",
        top: 0,
        width: "5px",
      }
    },
    height: "60px",
    position: "relative",
  }, csstips.flexRoot, csstips.center, csstips.padding(0, 5));

  export const image = style({
    height: "60px",
    width: "60px",
  });

  export const username = style({
    marginLeft: "5px",
  })
}
