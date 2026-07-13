import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="container-editorial flex flex-col items-center gap-4 py-32 text-center">
            <p className="eyebrow">404</p>
            <h1 className="mt-2 text-4xl text-ink sm:text-5xl">페이지를 찾을 수 없습니다</h1>
            <p className="max-w-sm text-sm text-stone">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
            <Link href="/browse" className="btn-browse mt-4">
                갤러리로 돌아가기
            </Link>
        </div>
    );
}
