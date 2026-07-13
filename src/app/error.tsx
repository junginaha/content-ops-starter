'use client';

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <Container className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
            <p className="text-[18px] font-semibold text-ink">문제가 발생했습니다.</p>
            <p className="text-[14px] text-ink-soft">잠시 후 다시 시도해 주세요.</p>
            <Button variant="secondary" onClick={reset}>
                다시 시도
            </Button>
        </Container>
    );
}
