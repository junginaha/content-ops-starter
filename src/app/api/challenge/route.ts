import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimited } from '@/lib/security/apiGuard';
import { issueChallenge } from '@/lib/security/pow';

export async function POST(request: NextRequest) {
    const rateLimitResponse = checkRateLimited(request, 'challenge', 60, 60_000);
    if (rateLimitResponse) return rateLimitResponse;

    return NextResponse.json(issueChallenge());
}
