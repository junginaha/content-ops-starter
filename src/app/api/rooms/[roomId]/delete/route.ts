import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { checkCsrf, checkRateLimited } from '@/lib/security/apiGuard';
import { deleteRequestSchema } from '@/lib/validation/schemas';
import { getDb } from '@/lib/db';
import { rooms } from '@/lib/db/schema';
import { verifySecret } from '@/lib/security/password';

export async function POST(request: NextRequest, context: { params: Promise<{ roomId: string }> }) {
    const csrfResponse = checkCsrf(request);
    if (csrfResponse) return csrfResponse;

    const rateLimitResponse = checkRateLimited(request, 'delete_room', 10, 10 * 60_000);
    if (rateLimitResponse) return rateLimitResponse;

    const { roomId } = await context.params;
    const json = await request.json().catch(() => null);
    const parsed = deleteRequestSchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
    }

    const db = getDb();
    const roomRows = await db.select().from(rooms).where(eq(rooms.publicId, roomId)).limit(1);
    const room = roomRows[0];
    if (!room) {
        return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    const valid = await verifySecret(parsed.data.deleteKey, room.ownerDeleteKeyHash);
    if (!valid) {
        return NextResponse.json({ error: 'invalid_key' }, { status: 403 });
    }

    await db.delete(rooms).where(eq(rooms.id, room.id));

    return NextResponse.json({ deleted: true });
}
