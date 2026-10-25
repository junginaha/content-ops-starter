import React from 'react';

const PATHS = {
    grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
    folder: 'M4 6a1 1 0 011-1h4l2 2h8a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V6z',
    book: 'M5 4h9a3 3 0 013 3v13H8a3 3 0 00-3 3V4z M17 4v16',
    question: 'M9 9a3 3 0 115 2.2c-.9.6-1.5 1.1-1.5 2.3M12 17h.01M12 21a9 9 0 100-18 9 9 0 000 18z',
    trend: 'M3 17l6-6 4 4 8-8M15 7h6v6',
    prompt: 'M4 6h16M4 12h10M4 18h7',
    research: 'M11 4a7 7 0 105.3 11.6l4.1 4.1 1.4-1.4-4.1-4.1A7 7 0 0011 4z',
    script: 'M6 3h9l5 5v13H6zM15 3v5h5M9 12h6M9 16h6',
    scene: 'M3 6h18v12H3zM3 6l4 12M9 6l4 12M15 6l4 12',
    image: 'M4 5h16v14H4zM4 16l4-4 3 3 5-6 4 5M9 9a1 1 0 100-2 1 1 0 000 2z',
    voice: 'M12 3a3 3 0 013 3v6a3 3 0 01-6 0V6a3 3 0 013-3zM6 11a6 6 0 0012 0M12 19v2',
    music: 'M9 18a3 3 0 100-6 3 3 0 000 6zM9 18V5l11-2v11M18 14a3 3 0 100-6 3 3 0 000 6z',
    thumbnail: 'M4 5h16v14H4zM9 9.5v5l4.5-2.5z',
    seo: 'M11 4a7 7 0 105.3 11.6l4.1 4.1 1.4-1.4-4.1-4.1A7 7 0 0011 4zM8 11h6M11 8v6',
    assets: 'M4 7l8-4 8 4-8 4-8-4zM4 7v10l8 4M20 7v10l-8 4M12 11v10',
    automation: 'M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8M12 8a4 4 0 100 8 4 4 0 000-8z',
    settings:
        'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.6-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.6-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.6V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.6 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.6 1z',
    plus: 'M12 4v16M4 12h16',
    arrow: 'M5 12h14M13 6l6 6-6 6'
};

export default function Icon({ name, className = 'w-4 h-4' }) {
    const d = PATHS[name];
    if (!d) return null;
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
            <path d={d} />
        </svg>
    );
}
