import * as React from 'react';
import * as classNames from 'classnames';
import './Button.scss';

export interface ButtonProps {
    selected?: boolean;
    className?: string;
    text: string;
    onClick: () => void;
}

export const Button = ({className, selected, text, onClick}: ButtonProps) => {
    const componentClassName = classNames(
        'button',
        className,
        { 'selected': selected },
    );

    return (
        <a className={componentClassName} onClick={onClick}>{text}</a>
    );
};
