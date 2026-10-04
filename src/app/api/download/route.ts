import { NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/lib/env';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { getPurchaseByOrderId, registerDownload, DOWNLOAD_LIMIT } from '@/lib/purchases';
import { getPosterById } from '@/lib/posters';

const bodySchema = z.object({
    orderId: z.string().min(1)
});

const SIGNED_URL_TTL_SECONDS = 10 * 60;

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

    const purchase = await getPurchaseByOrderId(parsed.data.orderId);
    if (!purchase || purchase.payment_status !== 'paid') {
        return NextResponse.json({ error: '결제가 확인되지 않았습니다.' }, { status: 403 });
    }

    if (purchase.download_count >= purchase.download_limit) {
        return NextResponse.json({ error: '다운로드 가능 횟수를 초과했습니다.', downloadCount: purchase.download_count, downloadLimit: purchase.download_limit }, { status: 403 });
    }

    // The poster (and therefore the storage path) is looked up strictly via
    // the server-trusted purchase.poster_id — never from client input — so
    // there is no way to substitute a different poster's file here.
    const poster = await getPosterById(purchase.poster_id);
    if (!poster) {
        return NextResponse.json({ error: '포스터를 찾을 수 없습니다.' }, { status: 404 });
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.storage.from(env.privateStorageBucket).createSignedUrl(poster.original_storage_path, SIGNED_URL_TTL_SECONDS, {
        download: poster.original_filename
    });

    if (error || !data) {
        console.error('Failed to create signed download URL', error);
        return NextResponse.json({ error: '다운로드 링크 생성에 실패했습니다.' }, { status: 500 });
    }

    const updated = await registerDownload(purchase);

    return NextResponse.json({
        url: data.signedUrl,
        downloadCount: updated.download_count,
        downloadLimit: updated.download_limit ?? DOWNLOAD_LIMIT,
        expiresInSeconds: SIGNED_URL_TTL_SECONDS
    });
}
