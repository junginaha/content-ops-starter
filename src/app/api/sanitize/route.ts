import { NextRequest, NextResponse } from 'next/server';
import { checkCsrf, checkProofOfWork, checkRateLimited } from '@/lib/security/apiGuard';
import { sanitizeRequestSchema } from '@/lib/validation/schemas';
import { sanitizeText } from '@/lib/ai/sanitize';
import { logEvent } from '@/lib/logging/logger';

export async function POST(request: NextRequest) {
    const csrfResponse = checkCsrf(request);
    if (csrfResponse) return csrfResponse;

    const rateLimitResponse = checkRateLimited(request, 'sanitize', 20, 10 * 60_000);
    if (rateLimitResponse) return rateLimitResponse;

    const json = await request.json().catch(() => null);
    const parsed = sanitizeRequestSchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
    }

    const powResponse = checkProofOfWork(parsed.data.challenge, parsed.data.nonce);
    if (powResponse) return powResponse;

    // `parsed.data.text` (raw user text) is used only in this in-memory call and is never logged or persisted.
    const result = await sanitizeText(parsed.data.text);
    logEvent('sanitize_completed', { riskLevel: result.riskLevel, issueCount: result.detectedIssues.length, source: result.source });

    return NextResponse.json({
        sanitizedText: result.sanitizedText,
        riskLevel: result.riskLevel,
        detectedIssues: result.detectedIssues,
        explanation: result.explanation,
        recommendedAction: result.recommendedAction
    });
}
