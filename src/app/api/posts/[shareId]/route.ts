import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { posts, reactions } from '@/lib/db/schema';
import { AI_DISCLOSURE_TEXT } from '@/lib/constants';

export async function GET(_request: NextRequest, context: { params: Promise<{ shareId: string }> }) {
    const { shareId } = await context.params;
    const db = getDb();

    const postRows = await db.select().from(posts).where(eq(posts.publicId, shareId)).limit(1);
    const post = postRows[0];
    if (!post) {
        return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    const reactionRows = await db.select().from(reactions).where(eq(reactions.postId, post.id));
    const reactionCounts = { heard: 0, same_here: 0, support: 0, needs_help: 0 };
    for (const row of reactionRows) {
        reactionCounts[row.reactionType] = row.count;
    }

    return NextResponse.json({
        publicId: post.publicId,
        mode: post.mode,
        visibility: post.visibility,
        sanitizedText: post.sanitizedText,
        riskLevel: post.riskLevel,
        moderationStatus: post.moderationStatus,
        createdAt: post.createdAt,
        reactions: reactionCounts,
        aiDisclosure: AI_DISCLOSURE_TEXT
    });
}
