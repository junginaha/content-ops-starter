import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { checkCsrf, checkRateLimited } from '@/lib/security/apiGuard';
import { deleteRequestSchema } from '@/lib/validation/schemas';
import { getDb } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { verifySecret } from '@/lib/security/password';

export async function POST(request: NextRequest, context: { params: Promise<{ shareId: string }> }) {
    const csrfResponse = checkCsrf(request);
    if (csrfResponse) return csrfResponse;

    const rateLimitResponse = checkRateLimited(request, 'delete_post', 10, 10 * 60_000);
    if (rateLimitResponse) return rateLimitResponse;

    const { shareId } = await context.params;
    const json = await request.json().catch(() => null);
    const parsed = deleteRequestSchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
    }

    const db = getDb();
    const postRows = await db.select().from(posts).where(eq(posts.publicId, shareId)).limit(1);
    const post = postRows[0];
    if (!post) {
        return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    const valid = await verifySecret(parsed.data.deleteKey, post.deleteKeyHash);
    if (!valid) {
        return NextResponse.json({ error: 'invalid_key' }, { status: 403 });
    }

    await db.delete(posts).where(eq(posts.id, post.id));

    return NextResponse.json({ deleted: true });
}
