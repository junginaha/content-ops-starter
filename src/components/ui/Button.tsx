'use client';

import classNames from 'classnames';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    fullWidth?: boolean;
}

export function Button({ variant = 'primary', fullWidth, className, ...props }: ButtonProps) {
    return (
        <button
            className={classNames(
                'inline-flex min-h-[48px] items-center justify-center rounded-xl px-5 text-[15px] font-medium transition-colors duration-150 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40',
                {
                    'bg-action text-white hover:bg-[#0f1729] active:bg-[#0f1729]': variant === 'primary',
                    'border border-border bg-surface text-ink hover:bg-bg': variant === 'secondary',
                    'text-ink-soft hover:text-ink': variant === 'ghost',
                    'bg-accent text-white hover:bg-[#a83a3a]': variant === 'danger',
                    'w-full': fullWidth
                },
                className
            )}
            {...props}
        />
    );
}
