import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { requireAdminSession } from '@/lib/security/requireAdmin';
import { checkCsrf } from '@/lib/security/apiGuard';
import { moderationActionRequestSchema } from '@/lib/validation/schemas';
import { getDb } from '@/lib/db';
import { moderationEvents, posts } from '@/lib/db/schema';
import { generateInternalId } from '@/lib/security/ids';
import type { ModerationStatus } from '@/lib/moderation';

const ACTION_TO_STATUS: Record<string, ModerationStatus> = {
    approve: 'approved',
    reject: 'rejected',
    hide: 'hidden',
    block: 'blocked',
    unblock: 'approved'
};

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const authResponse = await requireAdminSession(request);
    if (authResponse) return authResponse;

    const csrfResponse = checkCsrf(request);
    if (csrfResponse) return csrfResponse;

    const { id } = await context.params;
    const json = await request.json().catch(() => null);
    const parsed = moderationActionRequestSchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
    }

    const db = getDb();
    const postRows = await db.select().from(posts).where(eq(posts.publicId, id)).limit(1);
    const post = postRows[0];
    if (!post) {
        return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    const newStatus = ACTION_TO_STATUS[parsed.data.action];
    await db.update(posts).set({ moderationStatus: newStatus, updatedAt: new Date() }).where(eq(posts.id, post.id));

    await db.insert(moderationEvents).values({
        id: generateInternalId(),
        postId: post.id,
        action: parsed.data.action,
        riskLevelAtEvent: post.riskLevel,
        actor: 'admin',
        note: parsed.data.note
    });

    return NextResponse.json({ moderationStatus: newStatus });
}
