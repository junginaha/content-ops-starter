import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
    return (
        <Container className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
            <p className="text-[18px] font-semibold text-ink">페이지를 찾을 수 없습니다.</p>
            <p className="text-[14px] text-ink-soft">링크가 잘못되었거나 삭제된 글일 수 있습니다.</p>
            <Link href="/">
                <Button variant="secondary">처음으로 돌아가기</Button>
            </Link>
        </Container>
    );
}
