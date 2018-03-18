import * as classNames from "classnames";
import * as React from "react";
import "./Button.scss";

export interface IButtonProps {
  selected?: boolean;
  className?: string;
  text: string;
  disabled?: boolean;
  onClick: () => void;
}

export const Button = ({ className, disabled, selected, text, onClick }: IButtonProps) => {
  const componentClassName = classNames("button", className, { selected, disabled });

  return (
    <a className={componentClassName} onClick={disabled ? undefined : onClick}>
      {text}
    </a>
  );
};
