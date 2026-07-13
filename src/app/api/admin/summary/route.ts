import { NextRequest, NextResponse } from 'next/server';
import { gte } from 'drizzle-orm';
import { requireAdminSession } from '@/lib/security/requireAdmin';
import { getDb } from '@/lib/db';
import { posts } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
    const authResponse = await requireAdminSession(request);
    if (authResponse) return authResponse;

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const db = getDb();
    const rows = await db
        .select({ createdAt: posts.createdAt, riskLevel: posts.riskLevel, moderationStatus: posts.moderationStatus, mode: posts.mode })
        .from(posts)
        .where(gte(posts.createdAt, since));

    const byRisk: Record<string, number> = { low: 0, medium: 0, high: 0, urgent: 0 };
    const byStatus: Record<string, number> = { auto_approved: 0, pending: 0, approved: 0, rejected: 0, hidden: 0, blocked: 0 };
    const byMode: Record<string, number> = { confess: 0, ask_opinion: 0, anonymous_say: 0, propose_to_org: 0 };
    const byDay = new Map<string, number>();

    for (const row of rows) {
        byRisk[row.riskLevel] += 1;
        byStatus[row.moderationStatus] += 1;
        byMode[row.mode] += 1;
        const day = row.createdAt.toISOString().slice(0, 10);
        byDay.set(day, (byDay.get(day) ?? 0) + 1);
    }

    const daily = Array.from(byDay.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count }));

    return NextResponse.json({ total: rows.length, byRisk, byStatus, byMode, daily });
}
