'use client';

export default function BrowseError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="container-editorial flex flex-col items-center gap-4 py-32 text-center">
            <p className="font-serif text-2xl text-ink">갤러리를 불러오지 못했습니다</p>
            <p className="max-w-sm text-sm text-stone">잠시 후 다시 시도해 주세요. 문제가 계속되면 관리자에게 문의해 주세요.</p>
            <button type="button" onClick={reset} className="btn-browse">
                다시 시도
            </button>
        </div>
    );
}
