import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { requireAdminSession } from '@/lib/security/requireAdmin';
import { checkCsrf } from '@/lib/security/apiGuard';
import { getDb } from '@/lib/db';
import { rightsReports } from '@/lib/db/schema';

const updateReportSchema = z.object({
    status: z.enum(['open', 'reviewing', 'resolved', 'dismissed'])
});

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const authResponse = await requireAdminSession(request);
    if (authResponse) return authResponse;

    const csrfResponse = checkCsrf(request);
    if (csrfResponse) return csrfResponse;

    const { id } = await context.params;
    const json = await request.json().catch(() => null);
    const parsed = updateReportSchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
    }

    const db = getDb();
    const reportRows = await db.select().from(rightsReports).where(eq(rightsReports.publicId, id)).limit(1);
    if (!reportRows[0]) {
        return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    const resolvedAt = parsed.data.status === 'resolved' || parsed.data.status === 'dismissed' ? new Date() : null;
    await db.update(rightsReports).set({ status: parsed.data.status, resolvedAt }).where(eq(rightsReports.publicId, id));

    return NextResponse.json({ status: parsed.data.status });
}
