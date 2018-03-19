import * as classNames from "classnames";
import { red } from 'csx';
import * as React from "react";
import { classes, Classes, color, Colors, csstips, Shadows, style } from "../styles";

export interface IErrorsProps {
  errors: string[];
}

export const Errors = ({ errors }: IErrorsProps) => {
  if (errors.length === 0) { return null; };

  const renderErrors = errors.map(error => (
    <div key={error} className={Styles.errorItem}>
      {error}
    </div>
  ))

  return (
    <div className={Styles.container}>
      {renderErrors}
      <a className={Styles.link} href="/">Go back</a>
    </div>
  );
};

namespace Styles {
  export const container = style({
    background: red.lighten(.3).toString(),
    boxShadow: Shadows.one,
    textAlign: "center",
  }, csstips.padding(10));

  export const errorItem = style({

  });

  export const link = style({
    color: "#000",
    fontSize: "12px",
    textDecoration: "none",
    textTransform: "uppercase",

  }, csstips.padding(10, 0, 0, 0), csstips.block);
}
