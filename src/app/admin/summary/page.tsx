import { gte } from 'drizzle-orm';
import { requireAdminPage } from '@/lib/security/adminGuard';
import { AdminNav } from '@/components/admin/AdminNav';
import { Container } from '@/components/ui/Container';
import { getDb } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { MODE_LABELS, RISK_LABELS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function AdminSummaryPage() {
    await requireAdminPage();

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const db = getDb();
    const rows = await db
        .select({ createdAt: posts.createdAt, riskLevel: posts.riskLevel, moderationStatus: posts.moderationStatus, mode: posts.mode })
        .from(posts)
        .where(gte(posts.createdAt, since));

    const byRisk: Record<string, number> = { low: 0, medium: 0, high: 0, urgent: 0 };
    const byMode: Record<string, number> = { confess: 0, ask_opinion: 0, anonymous_say: 0, propose_to_org: 0 };
    const byDay = new Map<string, number>();

    for (const row of rows) {
        byRisk[row.riskLevel] += 1;
        byMode[row.mode] += 1;
        const day = row.createdAt.toISOString().slice(0, 10);
        byDay.set(day, (byDay.get(day) ?? 0) + 1);
    }

    const daily = Array.from(byDay.entries())
        .sort(([a], [b]) => b.localeCompare(a))
        .slice(0, 14);

    return (
        <div className="min-h-screen">
            <AdminNav />
            <Container className="max-w-3xl py-6">
                <p className="mb-6 text-[14px] text-ink-soft">최근 30일 · 총 {rows.length}건</p>

                <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {Object.entries(byRisk).map(([risk, count]) => (
                        <div key={risk} className="rounded-xl border border-border bg-surface p-4">
                            <p className="text-[12px] text-ink-soft">{RISK_LABELS[risk]}</p>
                            <p className="text-[22px] font-semibold text-ink">{count}</p>
                        </div>
                    ))}
                </div>

                <p className="mb-3 text-[13px] font-medium text-ink-soft">모드별 분포</p>
                <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {Object.entries(byMode).map(([mode, count]) => (
                        <div key={mode} className="rounded-xl border border-border bg-surface p-4">
                            <p className="text-[12px] text-ink-soft">{MODE_LABELS[mode]}</p>
                            <p className="text-[22px] font-semibold text-ink">{count}</p>
                        </div>
                    ))}
                </div>

                <p className="mb-3 text-[13px] font-medium text-ink-soft">최근 일별 게시량</p>
                {daily.length === 0 ? (
                    <p className="text-[13px] text-ink-soft">최근 30일간 게시된 글이 없습니다.</p>
                ) : (
                    <ul className="flex flex-col gap-1.5">
                        {daily.map(([date, count]) => (
                            <li key={date} className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-[13px]">
                                <span className="text-ink-soft">{date}</span>
                                <span className="font-medium text-ink">{count}건</span>
                            </li>
                        ))}
                    </ul>
                )}
            </Container>
        </div>
    );
}
