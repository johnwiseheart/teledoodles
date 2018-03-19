import { rem } from "csx";
import * as React from "react";
import { Colors, csstips, style } from "../styles";

export interface IInputProps {
  autoFocus?: boolean;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export const Input = ({ autoFocus, placeholder, value, onChange }: IInputProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value);

  return (
    <div className={Styles.inputGroupClass}>
      <input
        className={Styles.inputClass}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    </div>
  );
};

namespace Styles {
  export const inputGroupClass = style(csstips.vertical);

  export const inputClass = style(
    {
      border: `1px solid ${Colors.primary}`,
      fontSize: rem(1),
      lineHeight: "45px",
      textAlign: "center",
    },
    csstips.flex,
    csstips.padding(0, 5),
    csstips.margin(5, 0),
  );
}
