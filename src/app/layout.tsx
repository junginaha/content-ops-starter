import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { env } from '@/lib/env';

const heading = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    variable: '--font-heading',
    display: 'swap'
});

const body = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    variable: '--font-body',
    display: 'swap'
});

export const metadata: Metadata = {
    metadataBase: new URL(env.siteUrl),
    title: {
        default: 'Travelog — Travel Sketch Archive',
        template: '%s | Travelog'
    },
    description: '세계 각지의 랜드마크와 여행지를 취재하여 펜화·수채화 기법으로 기록한 여행 포스터 아카이브, Travelog.',
    openGraph: {
        type: 'website',
        siteName: 'Travelog',
        locale: 'ko_KR'
    },
    twitter: {
        card: 'summary_large_image'
    },
    icons: {
        icon: '/favicon.svg'
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko" className={`${heading.variable} ${body.variable}`}>
            <body className="flex min-h-screen flex-col bg-ivory text-ink">
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory"
                >
                    본문으로 건너뛰기
                </a>
                <SiteHeader />
                <main id="main-content" className="flex-1">
                    {children}
                </main>
                <SiteFooter />
            </body>
        </html>
    );
}
