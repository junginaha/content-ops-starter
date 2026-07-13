'use client';

import { useEffect, useState } from 'react';
import { env } from '@/lib/env';
import { requestTossPayment } from '@/lib/toss-client';
import { getStoredOrderId, rememberPurchase } from '@/lib/purchase-storage.client';

type Status = 'idle' | 'creating-order' | 'redirecting' | 'purchased' | 'downloading' | 'error' | 'exhausted';

const KRW_FORMAT = new Intl.NumberFormat('ko-KR');

export function PurchaseSection({ posterId, priceKrw }: { posterId: string; priceKrw: number }) {
    const [agreed, setAgreed] = useState(false);
    const [status, setStatus] = useState<Status>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);

    useEffect(() => {
        const stored = getStoredOrderId(posterId);
        if (stored) {
            setOrderId(stored);
            setStatus('purchased');
        }
    }, [posterId]);

    async function handlePurchase() {
        if (!agreed || status === 'creating-order' || status === 'redirecting') return;
        setErrorMessage(null);
        setStatus('creating-order');
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ posterId })
            });
            if (!res.ok) throw new Error('order-failed');
            const order = (await res.json()) as { orderId: string; amount: number; orderName: string };

            setStatus('redirecting');
            const origin = window.location.origin;
            await requestTossPayment(env.tossClientKey, {
                amount: order.amount,
                orderId: order.orderId,
                orderName: order.orderName,
                successUrl: `${origin}/purchase/success`,
                failUrl: `${origin}/purchase/fail`
            });
        } catch {
            setStatus('error');
            setErrorMessage('결제를 다시 시도해주세요.');
        }
    }

    async function handleDownload() {
        if (!orderId) return;
        setStatus('downloading');
        setErrorMessage(null);
        try {
            const res = await fetch('/api/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId })
            });
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 403 && typeof data.downloadCount === 'number') {
                    setStatus('exhausted');
                    setErrorMessage('다운로드 가능 횟수(5회)를 모두 사용했습니다.');
                    return;
                }
                throw new Error(data.error ?? 'download-failed');
            }
            rememberPurchase(posterId, orderId);
            window.location.href = data.url;
            setStatus('purchased');
        } catch {
            setStatus('error');
            setErrorMessage('다운로드에 실패했습니다. 다시 시도해주세요.');
        }
    }

    const isPurchased = status === 'purchased' || status === 'downloading' || status === 'exhausted';

    return (
        <section aria-labelledby="purchase-heading" className="rounded-sm border border-line bg-ivory p-6 sm:p-8">
            <h2 id="purchase-heading" className="font-serif text-2xl text-ink">
                소장하세요
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone">여행의 한 장면을 고해상도 디지털 포스터로 소장하세요.</p>

            <p className="mt-6 font-serif text-3xl text-ink">₩{KRW_FORMAT.format(priceKrw)}</p>

            <ul className="mt-4 space-y-1.5 text-sm text-stone">
                <li>· 고해상도 디지털 이미지</li>
                <li>· 결제 후 즉시 다운로드</li>
                <li>· 개인 소장 및 개인 인쇄 가능</li>
            </ul>

            <div className="mt-6 border-t border-line pt-6">
                <p className="text-xs leading-relaxed text-stone">
                    구매한 이미지는 개인 소장, 개인 기기 배경화면, 비상업적 개인 인쇄에 사용할 수 있습니다. 재판매, 재배포, 공유 링크 공개, 상품 제작 및 상업적 이용은 허용되지 않습니다.
                </p>

                {!isPurchased && (
                    <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-sm text-ink">
                        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-ink" />
                        <span>디지털 이미지 이용조건을 확인했습니다.</span>
                    </label>
                )}

                {!isPurchased ? (
                    <button type="button" onClick={handlePurchase} disabled={!agreed || status === 'creating-order' || status === 'redirecting'} className="btn-charcoal mt-5">
                        {status === 'creating-order' || status === 'redirecting' ? '결제 페이지를 준비하고 있습니다' : status === 'error' ? '결제를 다시 시도해주세요' : '990원에 소장하기'}
                    </button>
                ) : (
                    <button type="button" onClick={handleDownload} disabled={status === 'downloading' || status === 'exhausted'} className="btn-charcoal mt-5">
                        {status === 'downloading' ? '다운로드 준비 중…' : status === 'exhausted' ? '다운로드 횟수 초과' : '다운로드하기'}
                    </button>
                )}

                {errorMessage && (
                    <p role="alert" className="mt-3 text-sm text-red-800">
                        {errorMessage}
                    </p>
                )}
            </div>
        </section>
    );
}
