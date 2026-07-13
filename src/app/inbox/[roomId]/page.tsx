import { and, desc, eq, inArray } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { TopBar } from '@/components/ui/TopBar';
import { Container } from '@/components/ui/Container';
import { CopyField } from '@/components/ui/CopyField';
import { ReactionBar } from '@/components/ui/ReactionBar';
import { getDb } from '@/lib/db';
import { posts, reactions, rooms } from '@/lib/db/schema';
import { MODE_LABELS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function InboxPage({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = await params;
    const db = getDb();

    const roomRows = await db.select().from(rooms).where(eq(rooms.publicId, roomId)).limit(1);
    const room = roomRows[0];
    if (!room) notFound();

    const postRows = await db
        .select()
        .from(posts)
        .where(and(eq(posts.roomId, room.id), inArray(posts.moderationStatus, ['auto_approved', 'approved'])))
        .orderBy(desc(posts.createdAt))
        .limit(50);

    const postIds = postRows.map((p) => p.id);
    const reactionRows = postIds.length > 0 ? await db.select().from(reactions).where(inArray(reactions.postId, postIds)) : [];
    const countsByPost = new Map<string, { heard: number; same_here: number; support: number; needs_help: number }>();
    for (const row of reactionRows) {
        const entry = countsByPost.get(row.postId) ?? { heard: 0, same_here: 0, support: 0, needs_help: 0 };
        entry[row.reactionType] = row.count;
        countsByPost.set(row.postId, entry);
    }

    return (
        <div className="min-h-screen">
            <TopBar backHref="/" title={room.title ?? '의견함'} />
            <Container className="flex flex-col gap-6 py-6">
                <div className="rounded-xl border border-border bg-surface p-4">
                    <CopyField label="이 의견함 코드" value={room.publicId} />
                    <p className="mt-2 text-[12px] leading-relaxed text-ink-soft">
                        글쓰기 화면에서 &apos;익명 의견함에 전달&apos;을 선택한 뒤 이 코드를 입력하면 이 의견함으로 전달됩니다.
                    </p>
                </div>

                {postRows.length === 0 ? (
                    <p className="py-10 text-center text-[14px] text-ink-soft">아직 전달된 이야기가 없습니다.</p>
                ) : (
                    <ul className="flex flex-col gap-4">
                        {postRows.map((post) => (
                            <li key={post.publicId} className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4">
                                <span className="text-[12px] font-medium text-ink-soft">{MODE_LABELS[post.mode]}</span>
                                <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-ink">{post.sanitizedText}</p>
                                <ReactionBar shareId={post.publicId} initialCounts={countsByPost.get(post.id) ?? { heard: 0, same_here: 0, support: 0, needs_help: 0 }} />
                            </li>
                        ))}
                    </ul>
                )}
            </Container>
        </div>
    );
}
