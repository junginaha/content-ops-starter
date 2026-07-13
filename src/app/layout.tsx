import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: '진주 — 진실의 주둥이',
    description: '아무에게도 하지 못한 말을 안전하게 다듬어 전하는 프라이버시 우선 서비스. 시대정신.',
    icons: {
        icon: '/favicon.svg'
    }
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#F7F6F2'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body className="min-h-screen bg-bg font-sans text-ink antialiased">{children}</body>
        </html>
    );
}
