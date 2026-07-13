import { desc } from 'drizzle-orm';
import { requireAdminPage } from '@/lib/security/adminGuard';
import { AdminNav } from '@/components/admin/AdminNav';
import { ReportStatusControl } from '@/components/admin/ReportStatusControl';
import { Container } from '@/components/ui/Container';
import { getDb } from '@/lib/db';
import { rightsReports } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

const REASON_LABELS: Record<string, string> = {
    personal_data: '개인정보 노출',
    defamation: '명예훼손',
    impersonation: '사칭',
    copyright: '저작권 침해',
    other: '기타'
};

export default async function AdminReportsPage() {
    await requireAdminPage();
    const db = getDb();
    const rows = await db.select().from(rightsReports).orderBy(desc(rightsReports.createdAt)).limit(100);

    return (
        <div className="min-h-screen">
            <AdminNav />
            <Container className="max-w-3xl py-6">
                {rows.length === 0 ? (
                    <p className="py-16 text-center text-[14px] text-ink-soft">접수된 신고가 없습니다.</p>
                ) : (
                    <ul className="flex flex-col gap-4">
                        {rows.map((report) => (
                            <li key={report.publicId} className="rounded-2xl border border-border bg-surface p-4">
                                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 text-[12px] text-ink-soft">
                                        <span>{REASON_LABELS[report.reason]}</span>
                                        <span>· 대상: {report.targetPostPublicId}</span>
                                    </div>
                                    <ReportStatusControl publicId={report.publicId} status={report.status} />
                                </div>
                                <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-ink">{report.description}</p>
                                {report.contactEmail && <p className="mt-2 text-[12px] text-ink-soft">회신처: {report.contactEmail}</p>}
                            </li>
                        ))}
                    </ul>
                )}
            </Container>
        </div>
    );
}
