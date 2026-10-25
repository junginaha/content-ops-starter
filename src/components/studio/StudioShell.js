import React, { useState } from 'react';
import Head from 'next/head';
import Sidebar from './Sidebar';
import Icon from './ui/Icon';

export default function StudioShell({ title, eyebrow, actions, children, pageTitle }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="studio-root min-h-screen bg-studio-black text-studio-ink font-studio-sans">
            <Head>
                <title>{pageTitle ? `${pageTitle} — Question Studio` : 'Question Studio'}</title>
                <meta name="description" content="Question Studio — the AI creative operating system for documentary-style book videos." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className="flex">
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 min-w-0">
                    <header className="sticky top-0 z-30 bg-studio-black/90 backdrop-blur border-b border-studio-line">
                        <div className="flex items-center justify-between gap-4 px-6 lg:px-12 py-5">
                            <div className="flex items-center gap-4 min-w-0">
                                <button
                                    className="lg:hidden p-2 -ml-2 text-studio-muted hover:text-studio-ink"
                                    onClick={() => setSidebarOpen(true)}
                                    aria-label="Open menu"
                                >
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                        <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                                    </svg>
                                </button>
                                <div className="min-w-0">
                                    {eyebrow && <div className="text-xs uppercase tracking-[0.2em] text-studio-gold mb-1">{eyebrow}</div>}
                                    {title && <h1 className="font-studio-serif text-2xl md:text-3xl text-studio-ivory truncate">{title}</h1>}
                                </div>
                            </div>
                            {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
                        </div>
                    </header>
                    <main className="px-6 lg:px-12 py-10">{children}</main>
                </div>
            </div>
        </div>
    );
}
