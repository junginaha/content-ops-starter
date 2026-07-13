import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { checkCsrf, checkProofOfWork, checkRateLimited } from '@/lib/security/apiGuard';
import { createPostRequestSchema } from '@/lib/validation/schemas';
import { localSanitize } from '@/lib/ai/local-redaction';
import { computeExpiresAt, computeModerationStatus } from '@/lib/moderation';
import { generateDeleteKey, generateInternalId, generatePublicId } from '@/lib/security/ids';
import { hashSecret } from '@/lib/security/password';
import { getDb } from '@/lib/db';
import { moderationEvents, posts, reactions, rooms } from '@/lib/db/schema';
import { logEvent } from '@/lib/logging/logger';

const REACTION_TYPES = ['heard', 'same_here', 'support', 'needs_help'] as const;

export async function POST(request: NextRequest) {
    const csrfResponse = checkCsrf(request);
    if (csrfResponse) return csrfResponse;

    const rateLimitResponse = checkRateLimited(request, 'posts_create', 10, 10 * 60_000);
    if (rateLimitResponse) return rateLimitResponse;

    const json = await request.json().catch(() => null);
    const parsed = createPostRequestSchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
    }

    const powResponse = checkProofOfWork(parsed.data.challenge, parsed.data.nonce);
    if (powResponse) return powResponse;

    const { mode, visibility, targetRoomId } = parsed.data;

    // Server never trusts a client-reported risk level: the submitted (possibly user-edited)
    // text is re-run through the deterministic guard so PII/unsafe content can never slip through.
    const guarded = localSanitize(parsed.data.sanitizedText);

    const db = getDb();

    let roomId: string | null = null;
    if (visibility === 'inbox') {
        if (!targetRoomId) {
            return NextResponse.json({ error: 'room_required' }, { status: 400 });
        }
        const roomRows = await db.select().from(rooms).where(eq(rooms.publicId, targetRoomId)).limit(1);
        if (!roomRows[0]) {
            return NextResponse.json({ error: 'room_not_found' }, { status: 404 });
        }
        roomId = roomRows[0].id;
    }

    const moderationStatus = computeModerationStatus(visibility, guarded.riskLevel);
    const publicId = generatePublicId();
    const deleteKey = generateDeleteKey();
    const deleteKeyHash = await hashSecret(deleteKey);
    const id = generateInternalId();

    await db.insert(posts).values({
        id,
        publicId,
        roomId,
        mode,
        visibility,
        sanitizedText: guarded.sanitizedText,
        riskLevel: guarded.riskLevel,
        issueTypes: guarded.detectedIssues.map((issue) => issue.type),
        moderationStatus,
        deleteKeyHash,
        expiresAt: computeExpiresAt(visibility)
    });

    await db.insert(reactions).values(REACTION_TYPES.map((reactionType) => ({ id: generateInternalId(), postId: id, reactionType, count: 0 })));

    await db.insert(moderationEvents).values({
        id: generateInternalId(),
        postId: id,
        action: 'auto_flag',
        riskLevelAtEvent: guarded.riskLevel,
        actor: 'system',
        note: moderationStatus
    });

    logEvent('post_created', { riskLevel: guarded.riskLevel, moderationStatus, visibility, mode });

    return NextResponse.json({ publicId, deleteKey, riskLevel: guarded.riskLevel, moderationStatus }, { status: 201 });
}
