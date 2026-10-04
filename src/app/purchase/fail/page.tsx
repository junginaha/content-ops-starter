import type { Metadata } from 'next';
import Link from 'next/link';
import { getOrderByOrderId } from '@/lib/orders';
import { getPosterById } from '@/lib/posters';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: '결제 실패',
    robots: { index: false }
};

interface Props {
    searchParams: Promise<{ code?: string; message?: string; orderId?: string }>;
}

export default async function PurchaseFailPage({ searchParams }: Props) {
    const { message, orderId } = await searchParams;

    let retryHref = '/browse';
    if (orderId) {
        const order = await getOrderByOrderId(orderId);
        if (order) {
            const poster = await getPosterById(order.poster_id);
            if (poster) retryHref = `/${poster.continent_slug}/${poster.country_slug}/${poster.city_slug}/${poster.slug}`;
        }
    }

    return (
        <div className="container-editorial flex flex-col items-center gap-4 py-32 text-center">
            <p className="eyebrow">Travelog</p>
            <h1 className="mt-2 text-4xl text-ink sm:text-5xl">결제에 실패했습니다</h1>
            <p className="max-w-sm text-sm text-stone">{message ? decodeURIComponent(message) : '결제가 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.'}</p>
            <Link href={retryHref} className="btn-charcoal mt-4 w-auto px-8">
                결제를 다시 시도해주세요
            </Link>
            <Link href="/browse" className="mt-2 text-sm text-stone underline decoration-line underline-offset-4 transition-colors hover:text-ink">
                갤러리로 돌아가기
            </Link>
        </div>
    );
}
