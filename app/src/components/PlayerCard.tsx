import * as classNames from "classnames";
import { quote } from 'csx';
import * as React from "react";
import { IPlayer } from 'teledoodles-lib';
import { classes, Classes, color, Colors, csstips, Shadows, style } from "../styles";
import { Intent } from './utils';

export interface IPlayerCardProps {
  player: IPlayer;
}

export const PlayerCard = ({ player }: IPlayerCardProps) => {
  return (
    <div className={classes(Classes.panel, Styles.player(player.isReady))}>
      {player.username}
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
    height: "40px",
    position: "relative",
  }, csstips.flexRoot, csstips.center, csstips.padding(15))
}
