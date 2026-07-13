import { and, desc, eq } from 'drizzle-orm';
import { requireAdminPage } from '@/lib/security/adminGuard';
import { AdminNav } from '@/components/admin/AdminNav';
import { ModerationActions } from '@/components/admin/ModerationActions';
import { Container } from '@/components/ui/Container';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { getDb } from '@/lib/db';
import { posts, riskLevelEnum, moderationStatusEnum } from '@/lib/db/schema';
import { MODE_LABELS, VISIBILITY_LABELS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<string, string> = {
    auto_approved: '자동 승인',
    pending: '검토 대기',
    approved: '승인됨',
    rejected: '거부됨',
    hidden: '숨김',
    blocked: '차단됨'
};

export default async function AdminQueuePage({ searchParams }: { searchParams: Promise<{ riskLevel?: string; status?: string }> }) {
    await requireAdminPage();
    const { riskLevel, status } = await searchParams;

    const db = getDb();
    const conditions = [];
    if (riskLevel && (riskLevelEnum.enumValues as readonly string[]).includes(riskLevel)) {
        conditions.push(eq(posts.riskLevel, riskLevel as (typeof riskLevelEnum.enumValues)[number]));
    }
    if (status && (moderationStatusEnum.enumValues as readonly string[]).includes(status)) {
        conditions.push(eq(posts.moderationStatus, status as (typeof moderationStatusEnum.enumValues)[number]));
    }

    const rows = await db
        .select()
        .from(posts)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(posts.createdAt))
        .limit(100);

    return (
        <div className="min-h-screen">
            <AdminNav />
            <Container className="max-w-3xl py-6">
                <form className="mb-6 flex flex-wrap gap-3" method="get">
                    <select name="riskLevel" defaultValue={riskLevel ?? ''} className="min-h-[40px] rounded-lg border border-border bg-surface px-3 text-[13px] text-ink">
                        <option value="">모든 위험도</option>
                        {riskLevelEnum.enumValues.map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                    <select name="status" defaultValue={status ?? ''} className="min-h-[40px] rounded-lg border border-border bg-surface px-3 text-[13px] text-ink">
                        <option value="">모든 상태</option>
                        {moderationStatusEnum.enumValues.map((value) => (
                            <option key={value} value={value}>
                                {STATUS_LABELS[value]}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="min-h-[40px] rounded-lg bg-action px-4 text-[13px] font-medium text-white">
                        적용
                    </button>
                </form>

                {rows.length === 0 ? (
                    <p className="py-16 text-center text-[14px] text-ink-soft">조건에 맞는 글이 없습니다.</p>
                ) : (
                    <ul className="flex flex-col gap-4">
                        {rows.map((post) => (
                            <li key={post.publicId} className="rounded-2xl border border-border bg-surface p-4">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <RiskBadge risk={post.riskLevel} />
                                    <span className="text-[12px] text-ink-soft">{STATUS_LABELS[post.moderationStatus]}</span>
                                    <span className="text-[12px] text-ink-soft">{MODE_LABELS[post.mode]}</span>
                                    <span className="text-[12px] text-ink-soft">{VISIBILITY_LABELS[post.visibility]}</span>
                                </div>
                                <p className="mb-3 whitespace-pre-wrap text-[14px] leading-relaxed text-ink">{post.sanitizedText}</p>
                                {post.issueTypes.length > 0 && (
                                    <p className="mb-3 text-[12px] text-ink-soft">감지된 유형: {post.issueTypes.join(', ')}</p>
                                )}
                                <ModerationActions publicId={post.publicId} />
                            </li>
                        ))}
                    </ul>
                )}
            </Container>
        </div>
    );
}
