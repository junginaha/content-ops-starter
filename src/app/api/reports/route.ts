import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { checkCsrf, checkRateLimited } from '@/lib/security/apiGuard';
import { reportRequestSchema } from '@/lib/validation/schemas';
import { generateInternalId, generatePublicId } from '@/lib/security/ids';
import { getDb } from '@/lib/db';
import { posts, rightsReports } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
    const csrfResponse = checkCsrf(request);
    if (csrfResponse) return csrfResponse;

    const rateLimitResponse = checkRateLimited(request, 'reports_create', 10, 10 * 60_000);
    if (rateLimitResponse) return rateLimitResponse;

    const json = await request.json().catch(() => null);
    const parsed = reportRequestSchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
    }

    const db = getDb();
    const targetRows = await db.select().from(posts).where(eq(posts.publicId, parsed.data.targetPostPublicId)).limit(1);
    if (!targetRows[0]) {
        return NextResponse.json({ error: 'target_not_found' }, { status: 404 });
    }

    const publicId = generatePublicId();
    await db.insert(rightsReports).values({
        id: generateInternalId(),
        publicId,
        targetPostPublicId: parsed.data.targetPostPublicId,
        reason: parsed.data.reason,
        description: parsed.data.description,
        contactEmail: parsed.data.contactEmail || null
    });

    return NextResponse.json({ publicId }, { status: 201 });
}
