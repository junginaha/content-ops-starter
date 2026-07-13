import Link from 'next/link';

export function SiteFooter() {
    return (
        <footer className="border-t border-line bg-beige">
            <div className="container-editorial flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="font-serif text-lg text-ink">Travelog</p>
                    <p className="mt-1 max-w-sm text-sm text-stone">취재를 기반으로 제작한 펜화·수채화 여행 포스터 아카이브.</p>
                </div>
                <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone">
                    <Link href="/browse" className="transition-colors hover:text-ink">
                        Browse
                    </Link>
                    <Link href="/license" className="transition-colors hover:text-ink">
                        이용약관(라이선스)
                    </Link>
                    <Link href="/terms" className="transition-colors hover:text-ink">
                        서비스 약관
                    </Link>
                    <Link href="/privacy" className="transition-colors hover:text-ink">
                        개인정보처리방침
                    </Link>
                </nav>
            </div>
            <div className="border-t border-line py-4">
                <p className="container-editorial text-xs text-stone">© {new Date().getFullYear()} Travelog. All artwork is original and independently produced.</p>
            </div>
        </footer>
    );
}
