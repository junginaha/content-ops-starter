import { NextRequest, NextResponse } from 'next/server';
import { and, desc, eq } from 'drizzle-orm';
import { requireAdminSession } from '@/lib/security/requireAdmin';
import { getDb } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import type { moderationStatusEnum, riskLevelEnum } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
    const authResponse = await requireAdminSession(request);
    if (authResponse) return authResponse;

    const { searchParams } = new URL(request.url);
    const riskLevel = searchParams.get('riskLevel') as (typeof riskLevelEnum.enumValues)[number] | null;
    const status = searchParams.get('status') as (typeof moderationStatusEnum.enumValues)[number] | null;

    const db = getDb();
    const conditions = [];
    if (riskLevel) conditions.push(eq(posts.riskLevel, riskLevel));
    if (status) conditions.push(eq(posts.moderationStatus, status));

    const rows = await db
        .select({
            publicId: posts.publicId,
            mode: posts.mode,
            visibility: posts.visibility,
            sanitizedText: posts.sanitizedText,
            riskLevel: posts.riskLevel,
            issueTypes: posts.issueTypes,
            moderationStatus: posts.moderationStatus,
            createdAt: posts.createdAt
        })
        .from(posts)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(posts.createdAt))
        .limit(100);

    return NextResponse.json({ posts: rows });
}
