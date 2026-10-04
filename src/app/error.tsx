'use client';

export default function RootError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="container-editorial flex flex-col items-center gap-4 py-32 text-center">
            <p className="font-serif text-2xl text-ink">문제가 발생했습니다</p>
            <p className="max-w-sm text-sm text-stone">페이지를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
            <button type="button" onClick={reset} className="btn-browse">
                다시 시도
            </button>
        </div>
    );
}
