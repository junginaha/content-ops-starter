import type { ReactNode } from 'react';
import { TopBar } from '@/components/ui/TopBar';
import { Container } from '@/components/ui/Container';

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="min-h-screen">
            <TopBar backHref="/" title={title} />
            <Container className="flex flex-col gap-4 py-8 text-[14px] leading-relaxed text-ink [&_h2]:mt-4 [&_h2]:text-[16px] [&_h2]:font-semibold [&_h2]:text-ink [&_p]:text-ink-soft [&_li]:text-ink-soft">
                {children}
            </Container>
        </div>
    );
}
