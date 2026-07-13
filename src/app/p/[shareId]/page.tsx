import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TopBar } from '@/components/ui/TopBar';
import { Container } from '@/components/ui/Container';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { AiDisclosure } from '@/components/ui/AiDisclosure';
import { ReactionBar } from '@/components/ui/ReactionBar';
import { getDb } from '@/lib/db';
import { posts, reactions } from '@/lib/db/schema';
import { MODE_LABELS } from '@/lib/constants';
import { isViewableInFeed } from '@/lib/moderation';

export const dynamic = 'force-dynamic';

export default async function PostPage({ params }: { params: Promise<{ shareId: string }> }) {
    const { shareId } = await params;
    const db = getDb();

    const postRows = await db.select().from(posts).where(eq(posts.publicId, shareId)).limit(1);
    const post = postRows[0];
    if (!post) notFound();

    const reactionRows = await db.select().from(reactions).where(eq(reactions.postId, post.id));
    const reactionCounts = { heard: 0, same_here: 0, support: 0, needs_help: 0 };
    for (const row of reactionRows) {
        reactionCounts[row.reactionType] = row.count;
    }

    const viewable = isViewableInFeed(post.moderationStatus);

    return (
        <div className="min-h-screen">
            <TopBar backHref="/" title={MODE_LABELS[post.mode]} />
            <Container className="flex flex-col gap-5 py-6">
                <RiskBadge risk={post.riskLevel} />

                {post.moderationStatus === 'pending' && (
                    <div className="rounded-xl border border-border bg-surface p-4 text-[13px] leading-relaxed text-ink-soft">
                        운영팀이 검토 중입니다. 검토가 끝날 때까지 이 글은 다른 사람에게 전달되지 않아요.
                    </div>
                )}
                {(post.moderationStatus === 'rejected' || post.moderationStatus === 'hidden' || post.moderationStatus === 'blocked') && (
                    <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-[13px] leading-relaxed text-ink">이 글은 더 이상 표시되지 않습니다.</div>
                )}

                <p className="whitespace-pre-wrap text-[16px] leading-relaxed text-ink">{post.sanitizedText}</p>

                <AiDisclosure />

                {viewable && <ReactionBar shareId={post.publicId} initialCounts={reactionCounts} />}

                <div className="flex gap-4 pt-2 text-[13px] text-ink-soft">
                    <Link href={`/manage?shareId=${post.publicId}`} className="underline decoration-border underline-offset-4 hover:text-ink">
                        이 글 관리하기
                    </Link>
                    <Link href={`/legal/rights-report?target=${post.publicId}`} className="underline decoration-border underline-offset-4 hover:text-ink">
                        권리침해 신고
                    </Link>
                </div>
            </Container>
        </div>
    );
}
