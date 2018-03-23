import { rem } from "csx";
import * as React from "react";
import { Colors, csstips, Shadows, style } from "../styles";
import { Intent } from './utils';

export interface IInputProps {
  autoFocus?: boolean;
  placeholder?: string;
  value: string;
  intent?: Intent;
  onChange: (value: string) => void;
}

export const Input = ({ autoFocus, intent, placeholder, value, onChange }: IInputProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value);

  return (
    <div className={Styles.inputGroupClass}>
      <input
        className={Styles.inputClass(intent || Intent.INFO)}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    </div>
  );
};

namespace Styles {
  const colors = {
    [Intent.INFO]: Colors.primary,
    [Intent.SUCCESS]: Colors.green,
    [Intent.DANGER]: Colors.red,
  }

  export const inputGroupClass = style({
    backgroundColor: Colors.white,
    boxShadow: Shadows.one,
  }, csstips.vertical, csstips.padding(10));

  export const inputClass = (intent: Intent) => style(
    {
      $nest: {
        "&::placeholder": {
          color: Colors.grey,
          fontSize: rem(1),
          textTransform: "uppercase",
        }
      },
      border: 0,
      borderBottom: `1px solid ${colors[intent]}`,
      color: colors[intent],
      fontSize: rem(2),
      lineHeight: "50px",
      outline: 0,
      textAlign: "center",
    },
    csstips.flex,
    csstips.padding(0, 5),
    csstips.margin(5, 0),
  );
}
