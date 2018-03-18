import * as classNames from "classnames";
import * as React from "react";
import { classes, Classes, color, Colors, csstips, Shadows, style } from "../styles";

export interface IButtonProps {
  selected?: boolean;
  className?: string;
  text: string;
  disabled?: boolean;
  onClick: () => void;
}

export const Button = ({ className, disabled, selected, text, onClick }: IButtonProps) => {
  const componentClassName = classes(Styles.button, className, selected && Styles.selected, disabled && Styles.disabled );

  return (
    <a className={componentClassName} onClick={disabled ? undefined : onClick}>
      {text}
    </a>
  );
};

namespace Styles {
  export const button = style({
    $nest: {
      "&:hover": {
        backgroundColor: Colors.primaryDark,
      }
    },
    backgroundColor: Colors.primary,
    boxShadow: Shadows.one,
    color: Colors.primaryText,
    display: "block",
    flex: 1,
    lineHeight: "30px",
    minHeight: "30px",
    textAlign: "center",
    textTransform: "uppercase",
  }, csstips.padding(10, 0), csstips.margin(5, 0));

  export const selected = style({
    backgroundColor: Colors.primaryDarker,
  })

  export const disabled = style({
    $nest: {
      "&:hover": {
        backgroundColor: Colors.primaryLight,
      }
    },
    backgroundColor: Colors.primaryLight,
  })
}