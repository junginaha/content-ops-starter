import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';

const VARIANTS = {
    primary: 'bg-studio-gold text-studio-black hover:bg-studio-goldLight border border-transparent',
    secondary: 'bg-transparent text-studio-ink border border-studio-line hover:border-studio-gold hover:text-studio-gold',
    ghost: 'bg-transparent text-studio-muted hover:text-studio-ink border border-transparent',
    dark: 'bg-studio-panel text-studio-ink border border-studio-line hover:border-studio-goldLight'
};

const SIZES = {
    sm: 'text-xs px-3.5 py-2',
    md: 'text-sm px-5 py-3',
    lg: 'text-sm px-7 py-4 tracking-wide'
};

export default function Button({ children, variant = 'primary', size = 'md', className, href, as, disabled, ...props }) {
    const cls = classNames(
        'inline-flex items-center justify-center gap-2 rounded-full font-studio-sans font-medium transition-colors duration-200',
        VARIANTS[variant],
        SIZES[size],
        disabled && 'opacity-40 pointer-events-none',
        className
    );
    if (href) {
        return (
            <Link href={href} className={cls} {...props}>
                {children}
            </Link>
        );
    }
    const Comp = as || 'button';
    return (
        <Comp className={cls} disabled={disabled} {...props}>
            {children}
        </Comp>
    );
}
