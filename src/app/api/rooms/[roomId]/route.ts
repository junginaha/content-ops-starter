import { NextRequest, NextResponse } from 'next/server';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { posts, reactions, rooms } from '@/lib/db/schema';

export async function GET(_request: NextRequest, context: { params: Promise<{ roomId: string }> }) {
    const { roomId } = await context.params;
    const db = getDb();

    const roomRows = await db.select().from(rooms).where(eq(rooms.publicId, roomId)).limit(1);
    const room = roomRows[0];
    if (!room) {
        return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    const postRows = await db
        .select()
        .from(posts)
        .where(and(eq(posts.roomId, room.id), inArray(posts.moderationStatus, ['auto_approved', 'approved'])))
        .orderBy(desc(posts.createdAt))
        .limit(50);

    const postIds = postRows.map((p) => p.id);
    const reactionRows = postIds.length > 0 ? await db.select().from(reactions).where(inArray(reactions.postId, postIds)) : [];
    const countsByPost = new Map<string, Record<string, number>>();
    for (const row of reactionRows) {
        const entry = countsByPost.get(row.postId) ?? { heard: 0, same_here: 0, support: 0, needs_help: 0 };
        entry[row.reactionType] = row.count;
        countsByPost.set(row.postId, entry);
    }

    return NextResponse.json({
        publicId: room.publicId,
        kind: room.kind,
        title: room.title,
        createdAt: room.createdAt,
        posts: postRows.map((p) => ({
            publicId: p.publicId,
            mode: p.mode,
            sanitizedText: p.sanitizedText,
            riskLevel: p.riskLevel,
            createdAt: p.createdAt,
            reactions: countsByPost.get(p.id) ?? { heard: 0, same_here: 0, support: 0, needs_help: 0 }
        }))
    });
}
