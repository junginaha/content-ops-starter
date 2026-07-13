import { NextRequest, NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { requireAdminSession } from '@/lib/security/requireAdmin';
import { getDb } from '@/lib/db';
import { rightsReports } from '@/lib/db/schema';
import type { reportStatusEnum } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
    const authResponse = await requireAdminSession(request);
    if (authResponse) return authResponse;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as (typeof reportStatusEnum.enumValues)[number] | null;

    const db = getDb();
    const rows = await db
        .select()
        .from(rightsReports)
        .where(status ? eq(rightsReports.status, status) : undefined)
        .orderBy(desc(rightsReports.createdAt))
        .limit(100);

    return NextResponse.json({ reports: rows });
}
