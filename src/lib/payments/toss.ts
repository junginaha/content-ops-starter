import 'server-only';
import { env } from '@/lib/env';
import { getOrderByOrderId, markOrderStatus } from '@/lib/orders';
import { createPurchaseIdempotent, getPurchaseByOrderId } from '@/lib/purchases';
import { getPosterById } from '@/lib/posters';
import type { Purchase } from '@/types/database';

const TOSS_CONFIRM_URL = 'https://api.tosspayments.com/v1/payments/confirm';

export class PaymentVerificationError extends Error {
    constructor(
        message: string,
        public code: string
    ) {
        super(message);
    }
}

interface TossConfirmResponse {
    status: string;
    orderId: string;
    totalAmount: number;
    currency: string;
    paymentKey: string;
    transactionKey?: string;
    method?: string;
}

/**
 * Confirms a Toss payment server-side and grants a purchase. This is the
 * single security-critical choke point: every amount/currency/status check
 * happens here against our own stored order, never against client input.
 */
export async function confirmTossPayment(params: { orderId: string; paymentKey: string; amount: number }): Promise<{ purchase: Purchase; posterSlugPath: string }> {
    const { orderId, paymentKey, amount } = params;

    const order = await getOrderByOrderId(orderId);
    if (!order) {
        throw new PaymentVerificationError('알 수 없는 주문입니다.', 'ORDER_NOT_FOUND');
    }

    const poster = await getPosterById(order.poster_id);
    if (!poster) {
        throw new PaymentVerificationError('연결된 포스터를 찾을 수 없습니다.', 'POSTER_NOT_FOUND');
    }
    const posterSlugPath = `${poster.continent_slug}/${poster.country_slug}/${poster.city_slug}/${poster.slug}`;

    // Idempotent: if this order was already confirmed, return the existing purchase
    // instead of re-confirming with Toss (protects against duplicate confirm calls,
    // e.g. the user refreshing the success page).
    const existingPurchase = await getPurchaseByOrderId(orderId);
    if (existingPurchase) {
        return { purchase: existingPurchase, posterSlugPath };
    }

    if (order.status !== 'pending') {
        throw new PaymentVerificationError('이미 처리된 주문입니다.', 'ORDER_NOT_PENDING');
    }

    // The amount we compare against is ALWAYS the server-stored order amount
    // (set from poster.price_krw at order-creation time) — the amount
    // reported in the redirect URL is only used as a tamper sanity check.
    if (amount !== order.amount || order.currency !== 'KRW') {
        await markOrderStatus(orderId, 'failed');
        throw new PaymentVerificationError('결제 금액이 일치하지 않습니다.', 'AMOUNT_MISMATCH');
    }

    const authHeader = `Basic ${Buffer.from(`${env.tossSecretKey}:`).toString('base64')}`;
    const response = await fetch(TOSS_CONFIRM_URL, {
        method: 'POST',
        headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paymentKey, orderId, amount: order.amount })
    });

    const payload = (await response.json()) as TossConfirmResponse & { message?: string; code?: string };

    if (!response.ok) {
        await markOrderStatus(orderId, 'failed');
        throw new PaymentVerificationError(payload.message ?? '결제 승인에 실패했습니다.', payload.code ?? 'CONFIRM_FAILED');
    }

    if (payload.status !== 'DONE' || payload.orderId !== orderId || payload.totalAmount !== order.amount || payload.currency !== 'KRW') {
        await markOrderStatus(orderId, 'failed');
        throw new PaymentVerificationError('결제 승인 정보가 일치하지 않습니다.', 'CONFIRM_MISMATCH');
    }

    const purchase = await createPurchaseIdempotent({
        orderId,
        posterId: poster.id,
        paymentKey: payload.paymentKey,
        transactionId: payload.transactionKey ?? null,
        amount: payload.totalAmount
    });

    await markOrderStatus(orderId, 'confirmed');

    return { purchase, posterSlugPath };
}
