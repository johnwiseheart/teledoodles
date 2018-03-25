import * as classNames from "classnames";
import * as React from "react";
import { classes, Classes, color, Colors, csstips, Shadows, style } from "../styles";
import { Intent } from './utils';

export interface IButtonProps {
  selected?: boolean;
  className?: string;
  text: string;
  disabled?: boolean;
  onClick: () => void;
  intent?: Intent;
}

export const Button = ({ className, disabled, intent, selected, text, onClick }: IButtonProps) => {
  const componentClassName = classes(
    className,
    Styles.base,
    !selected && !disabled && Styles.defaultStyle(intent || Intent.INFO),
    selected && Styles.selected(intent || Intent.INFO),
    disabled && Styles.disabled,
  );

  return (
    <a className={componentClassName} onClick={disabled ? undefined : onClick}>
      {text}
    </a>
  );
};

namespace Styles {
  const colors = {
    [Intent.INFO]: Colors.primary,
    [Intent.SUCCESS]: Colors.green,
    [Intent.DANGER]: Colors.red,
  }

  export const base = style(
    {
      backgroundColor: Colors.white,
      boxShadow: Shadows.one,
      display: "block",
      lineHeight: "30px",
      minHeight: "50px",
      textAlign: "center",
      textTransform: "uppercase",
    },
    csstips.flex,
    csstips.padding(10, 0),
    csstips.margin(5, 0),
  );

  export const defaultStyle = (intent: Intent) => style({
    $nest: {
      "&&:active": {
        backgroundColor: color(colors[intent]).darken(.1).toString(),
        borderBottomColor: color(colors[intent]).darken(.1).toString()
      },
      "&:hover": {
        backgroundColor: colors[intent],
        color: Colors.white,
      },
    },
    borderBottom: `3px solid ${colors[intent]}`,
    color: colors[intent],
  })

  export const selected = (intent: Intent) => style({
    backgroundColor: colors[intent],
    color: Colors.white,
  });

  const disabledStyle = {
    backgroundColor: Colors.white,
    borderBottom: `3px solid ${Colors.grey}`,
    color: Colors.grey,
  };
  export const disabled = style({
    $nest: {
      "&&:active": disabledStyle,
      "&:hover": disabledStyle,
    },
    ...disabledStyle,
  });
}
