import React from 'react';
import classNames from 'classnames';

export default function SectionLabel({ children, className }) {
    return (
        <span className={classNames('block text-xs uppercase tracking-[0.2em] text-studio-gold font-studio-sans mb-4', className)}>
            {children}
        </span>
    );
}
