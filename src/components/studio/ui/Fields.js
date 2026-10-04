import React from 'react';
import classNames from 'classnames';

const fieldBase =
    'w-full rounded-xl bg-studio-charcoal border border-studio-line text-studio-ink placeholder-studio-muted/60 px-4 py-3 text-sm font-studio-sans focus:outline-none focus:border-studio-gold/70 transition-colors';

export function Field({ label, hint, children, className }) {
    return (
        <label className={classNames('block', className)}>
            {label && <span className="block mb-2 text-xs uppercase tracking-[0.12em] text-studio-muted font-studio-sans">{label}</span>}
            {children}
            {hint && <span className="block mt-1.5 text-xs text-studio-muted/70">{hint}</span>}
        </label>
    );
}

export function Input({ className, ...props }) {
    return <input className={classNames(fieldBase, className)} {...props} />;
}

export function Textarea({ className, rows = 4, ...props }) {
    return <textarea rows={rows} className={classNames(fieldBase, 'resize-none', className)} {...props} />;
}

export function Select({ className, children, ...props }) {
    return (
        <select className={classNames(fieldBase, 'appearance-none cursor-pointer', className)} {...props}>
            {children}
        </select>
    );
}
