import React from 'react';
import classNames from 'classnames';

export default function Card({ children, className, as, ...props }) {
    const Comp = as || 'div';
    return (
        <Comp
            className={classNames('bg-studio-panel border border-studio-line rounded-2xl', className)}
            {...props}
        >
            {children}
        </Comp>
    );
}
