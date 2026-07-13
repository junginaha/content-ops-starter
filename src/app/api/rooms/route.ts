import { NextRequest, NextResponse } from 'next/server';
import { checkCsrf, checkProofOfWork, checkRateLimited } from '@/lib/security/apiGuard';
import { createInboxRequestSchema } from '@/lib/validation/schemas';
import { generateDeleteKey, generateInternalId, generatePublicId } from '@/lib/security/ids';
import { hashSecret } from '@/lib/security/password';
import { getDb } from '@/lib/db';
import { rooms } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
    const csrfResponse = checkCsrf(request);
    if (csrfResponse) return csrfResponse;

    const rateLimitResponse = checkRateLimited(request, 'rooms_create', 5, 10 * 60_000);
    if (rateLimitResponse) return rateLimitResponse;

    const json = await request.json().catch(() => null);
    const parsed = createInboxRequestSchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
    }

    const powResponse = checkProofOfWork(parsed.data.challenge, parsed.data.nonce);
    if (powResponse) return powResponse;

    const db = getDb();
    const publicId = generatePublicId();
    const deleteKey = generateDeleteKey();
    const ownerDeleteKeyHash = await hashSecret(deleteKey);
    const id = generateInternalId();

    await db.insert(rooms).values({
        id,
        publicId,
        kind: parsed.data.kind,
        title: parsed.data.title || null,
        ownerDeleteKeyHash
    });

    return NextResponse.json({ publicId, deleteKey, kind: parsed.data.kind }, { status: 201 });
}
