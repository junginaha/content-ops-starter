import Link from 'next/link';

export function Pagination({ page, hasMore, searchParams }: { page: number; hasMore: boolean; searchParams: Record<string, string | undefined> }) {
    if (page === 1 && !hasMore) return null;

    function hrefFor(targetPage: number) {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(searchParams)) {
            if (value && key !== 'page') params.set(key, value);
        }
        if (targetPage > 1) params.set('page', String(targetPage));
        const qs = params.toString();
        return qs ? `/browse?${qs}` : '/browse';
    }

    return (
        <nav aria-label="페이지 이동" className="mt-16 flex items-center justify-center gap-4">
            {page > 1 ? (
                <Link href={hrefFor(page - 1)} className="btn-browse">
                    이전
                </Link>
            ) : (
                <span className="btn-browse pointer-events-none opacity-30">이전</span>
            )}
            <span className="text-sm text-stone">Page {page}</span>
            {hasMore ? (
                <Link href={hrefFor(page + 1)} className="btn-browse">
                    다음
                </Link>
            ) : (
                <span className="btn-browse pointer-events-none opacity-30">다음</span>
            )}
        </nav>
    );
}
