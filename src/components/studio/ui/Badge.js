import React from 'react';
import classNames from 'classnames';

const TONES = {
    gold: 'text-studio-gold border-studio-gold/40 bg-studio-gold/10',
    blue: 'text-studio-blueLight border-studio-blueLight/40 bg-studio-blueLight/10',
    muted: 'text-studio-muted border-studio-line bg-studio-charcoal',
    ivory: 'text-studio-ivory border-studio-ivory/30 bg-studio-ivory/5'
};

export default function Badge({ children, tone = 'muted', className }) {
    return (
        <span
            className={classNames(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.12em] font-studio-sans',
                TONES[tone],
                className
            )}
        >
            {children}
        </span>
    );
}
