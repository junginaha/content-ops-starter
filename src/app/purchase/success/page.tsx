import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { confirmTossPayment, PaymentVerificationError } from '@/lib/payments/toss';
import { getPosterById } from '@/lib/posters';
import { SuccessDownloadButton } from '@/components/SuccessDownloadButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: '소장 완료',
    robots: { index: false }
};

interface Props {
    searchParams: Promise<{ paymentKey?: string; orderId?: string; amount?: string }>;
}

function FailureNotice({ message }: { message: string }) {
    return (
        <div className="container-editorial flex flex-col items-center gap-4 py-32 text-center">
            <p className="font-serif text-2xl text-ink">결제를 확인할 수 없습니다</p>
            <p className="max-w-sm text-sm text-stone">{message}</p>
            <Link href="/browse" className="btn-browse">
                갤러리로 돌아가기
            </Link>
        </div>
    );
}

export default async function PurchaseSuccessPage({ searchParams }: Props) {
    const { paymentKey, orderId, amount } = await searchParams;

    // A success redirect and its query params are never treated as proof of
    // payment on their own — the download button only ever appears after
    // this server-side confirmTossPayment() call has verified the payment
    // against our own stored order and Toss's confirm API.
    if (!paymentKey || !orderId || !amount || Number.isNaN(Number(amount))) {
        return <FailureNotice message="결제 정보가 올바르지 않습니다. 다시 시도해 주세요." />;
    }

    try {
        const { purchase, posterSlugPath } = await confirmTossPayment({ orderId, paymentKey, amount: Number(amount) });
        const poster = await getPosterById(purchase.poster_id);
        if (!poster) return <FailureNotice message="구매한 포스터 정보를 찾을 수 없습니다." />;

        return (
            <div className="container-editorial flex flex-col items-center py-20 text-center sm:py-28">
                <p className="eyebrow">Travelog</p>
                <h1 className="mt-2 text-4xl text-ink sm:text-5xl">소장이 완료되었습니다</h1>
                <p className="mt-3 text-sm text-stone">
                    {purchase.amount.toLocaleString('ko-KR')}원 결제가 확인되었습니다.
                    <br />
                    아래 버튼을 눌러 고해상도 이미지를 다운로드하세요.
                </p>

                <div className="mt-10 w-full max-w-sm">
                    <div className="relative aspect-[5/7] w-full overflow-hidden rounded-sm border border-line bg-beige shadow-soft">
                        <Image src={poster.preview_image_url} alt={`${poster.city} — ${poster.viewpoint}`} fill sizes="384px" className="object-cover" />
                    </div>
                    <div className="mt-4 text-left">
                        <p className="font-serif text-xl text-ink">{poster.city}</p>
                        <p className="text-sm text-stone">{poster.viewpoint}</p>
                        <p className="mt-2 text-sm text-ink">결제 금액: ₩{purchase.amount.toLocaleString('ko-KR')}</p>
                    </div>
                </div>

                <div className="mt-8">
                    <SuccessDownloadButton posterId={poster.id} orderId={purchase.order_id} downloadCount={purchase.download_count} downloadLimit={purchase.download_limit} />
                </div>

                <p className="mt-6 max-w-sm text-xs leading-relaxed text-stone">
                    구매한 이미지는 개인 소장, 개인 기기 배경화면, 비상업적 개인 인쇄에 사용할 수 있습니다. 재판매·재배포·공유 링크 공개·상업적 이용은 허용되지 않습니다. 자세한 내용은{' '}
                    <Link href="/license" className="underline decoration-line underline-offset-4">
                        이용조건
                    </Link>
                    을 확인해 주세요.
                </p>

                <div className="mt-10 flex gap-4">
                    <Link href={`/${posterSlugPath}`} className="text-sm text-stone underline decoration-line underline-offset-4 transition-colors hover:text-ink">
                        포스터 페이지로 돌아가기
                    </Link>
                    <Link href="/browse" className="btn-browse">
                        갤러리로 돌아가기
                    </Link>
                </div>
            </div>
        );
    } catch (err) {
        const message = err instanceof PaymentVerificationError ? err.message : '결제 확인 중 오류가 발생했습니다.';
        return <FailureNotice message={message} />;
    }
}
