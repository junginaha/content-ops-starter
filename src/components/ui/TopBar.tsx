import Link from 'next/link';
import { Container } from './Container';
import { BRAND_NAME } from '@/lib/constants';

export function TopBar({ backHref, title }: { backHref?: string; title?: string }) {
    return (
        <header className="sticky top-0 z-10 border-b border-border bg-bg/95 backdrop-blur">
            <Container className="grid h-14 grid-cols-[36px_1fr_36px] items-center">
                {backHref ? (
                    <Link
                        href={backHref}
                        aria-label="뒤로 가기"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors duration-150 hover:bg-white hover:text-ink"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                ) : (
                    <span />
                )}
                <p className="text-center text-[15px] font-semibold tracking-tight text-ink">
                    {title ?? (
                        <Link href="/" className="text-ink">
                            {BRAND_NAME}
                        </Link>
                    )}
                </p>
                <span />
            </Container>
        </header>
    );
}
