import React from 'react';
import classNames from 'classnames';

export default function Tabs({ tabs, active, onChange }) {
    return (
        <div className="flex items-center gap-1 overflow-x-auto border-b border-studio-line no-scrollbar">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onChange(tab.key)}
                    className={classNames(
                        'relative whitespace-nowrap px-4 py-3 text-sm font-studio-sans transition-colors',
                        active === tab.key ? 'text-studio-ink' : 'text-studio-muted hover:text-studio-ink'
                    )}
                >
                    {tab.label}
                    {active === tab.key && <span className="absolute left-3 right-3 -bottom-px h-[2px] bg-studio-gold rounded-full" />}
                </button>
            ))}
        </div>
    );
}
