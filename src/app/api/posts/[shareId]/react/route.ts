import { NextRequest, NextResponse } from 'next/server';
import { and, eq, sql } from 'drizzle-orm';
import { checkCsrf, checkRateLimited } from '@/lib/security/apiGuard';
import { reactionRequestSchema } from '@/lib/validation/schemas';
import { getDb } from '@/lib/db';
import { posts, reactions } from '@/lib/db/schema';
import { isViewableInFeed } from '@/lib/moderation';

export async function POST(request: NextRequest, context: { params: Promise<{ shareId: string }> }) {
    const csrfResponse = checkCsrf(request);
    if (csrfResponse) return csrfResponse;

    const rateLimitResponse = checkRateLimited(request, 'react', 30, 10 * 60_000);
    if (rateLimitResponse) return rateLimitResponse;

    const { shareId } = await context.params;
    const json = await request.json().catch(() => null);
    const parsed = reactionRequestSchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
    }

    const db = getDb();
    const postRows = await db.select().from(posts).where(eq(posts.publicId, shareId)).limit(1);
    const post = postRows[0];
    if (!post || !isViewableInFeed(post.moderationStatus)) {
        return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    await db
        .update(reactions)
        .set({ count: sql`${reactions.count} + 1`, updatedAt: new Date() })
        .where(and(eq(reactions.postId, post.id), eq(reactions.reactionType, parsed.data.reactionType)));

    const reactionRows = await db.select().from(reactions).where(eq(reactions.postId, post.id));
    const reactionCounts = { heard: 0, same_here: 0, support: 0, needs_help: 0 };
    for (const row of reactionRows) {
        reactionCounts[row.reactionType] = row.count;
    }

    return NextResponse.json({ reactions: reactionCounts });
}
