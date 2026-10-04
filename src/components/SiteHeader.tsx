'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function SiteHeader() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-40 w-full transition-colors duration-500 ease-editorial ${
                scrolled ? 'border-b border-line bg-ivory/90 backdrop-blur-sm' : 'border-b border-transparent bg-transparent'
            }`}
        >
            <div className="container-editorial flex h-16 items-center justify-between sm:h-20">
                <Link href="/" className="font-serif text-xl font-medium tracking-tight text-ink sm:text-2xl">
                    Travelog
                </Link>
                <nav className="flex items-center gap-6">
                    <Link href="/browse" className="btn-browse">
                        BROWSE
                    </Link>
                </nav>
            </div>
        </header>
    );
}
