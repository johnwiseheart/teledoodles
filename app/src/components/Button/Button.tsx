import * as classNames from "classnames";
import * as React from "react";
import "./Button.scss";

export interface IButtonProps {
  selected?: boolean;
  className?: string;
  text: string;
  onClick: () => void;
}

export const Button = ({ className, selected, text, onClick }: IButtonProps) => {
  const componentClassName = classNames("button", className, { selected });

  return (
    <a className={componentClassName} onClick={onClick}>
      {text}
    </a>
  );
};
