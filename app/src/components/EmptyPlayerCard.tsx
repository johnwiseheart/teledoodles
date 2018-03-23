import * as classNames from "classnames";
import { quote } from 'csx';
import * as React from "react";
import { IPlayer } from 'teledoodles-lib';
import { classes, Classes, color, Colors, csstips, Shadows, style } from "../styles";
import { Intent } from './utils';

export const EmptyPlayerCard = () => {
  return (
    <div className={Styles.card}>
      Need four players to start
    </div>
  );
};

namespace Styles {
  export const card = style({
    backgroundColor: Colors.primaryLight,
    border: `1px dashed ${Colors.primary}`,
    boxShadow: Shadows.one,
    color: Colors.primary,
    height: "40px",
    position: "relative",
  }, csstips.flexRoot, csstips.centerCenter, csstips.padding(15))
}
