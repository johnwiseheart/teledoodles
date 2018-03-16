import * as React from 'react';
import './Input.scss';

export interface InputProps {
    autoFocus?: boolean;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
}

export const Input = ({ autoFocus, placeholder, value, onChange }: InputProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <div className="input-group">
            <input
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                autoFocus={autoFocus}
            />
        </div>
    );
};
