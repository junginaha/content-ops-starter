import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getPosterById } from '@/lib/posters';
import { createOrder } from '@/lib/orders';

const bodySchema = z.object({
    posterId: z.string().uuid()
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

    const poster = await getPosterById(parsed.data.posterId);
    if (!poster || poster.status !== 'published') {
        return NextResponse.json({ error: '포스터를 찾을 수 없습니다.' }, { status: 404 });
    }

    const order = await createOrder(poster);

    return NextResponse.json({
        orderId: order.order_id,
        amount: order.amount,
        currency: order.currency,
        orderName: `Travelog — ${poster.city} · ${poster.viewpoint}`
    });
}
