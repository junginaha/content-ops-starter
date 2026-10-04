import { NextResponse } from 'next/server';
import { z } from 'zod';
import { confirmTossPayment, PaymentVerificationError } from '@/lib/payments/toss';

const bodySchema = z.object({
    orderId: z.string().min(1),
    paymentKey: z.string().min(1),
    amount: z.coerce.number().int().positive()
});

export async function POST(request: Request) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    try {
        const { purchase, posterSlugPath } = await confirmTossPayment(parsed.data);
        return NextResponse.json({
            purchaseId: purchase.id,
            posterSlugPath,
            downloadLimit: purchase.download_limit,
            downloadCount: purchase.download_count
        });
    } catch (err) {
        if (err instanceof PaymentVerificationError) {
            return NextResponse.json({ error: err.message, code: err.code }, { status: 402 });
        }
        console.error('Payment confirmation failed', err);
        return NextResponse.json({ error: '결제 확인 중 오류가 발생했습니다.' }, { status: 500 });
    }
}
