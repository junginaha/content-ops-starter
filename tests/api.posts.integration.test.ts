import { createHash } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { POST as createPost } from '@/app/api/posts/route';
import { POST as reactToPost } from '@/app/api/posts/[shareId]/react/route';
import { POST as deletePost } from '@/app/api/posts/[shareId]/delete/route';
import { GET as adminQueue } from '@/app/api/admin/queue/route';
import { getDb } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { generateCsrfToken } from '@/lib/security/csrf';
import { ADMIN_SESSION_COOKIE, createAdminSession } from '@/lib/security/adminSession';

const CSRF_TOKEN = generateCsrfToken();

function solveChallenge(challenge: string, difficulty: number): string {
    let nonce = 0;
    while (!createHash('sha256').update(`${challenge}:${nonce}`).digest('hex').startsWith('0'.repeat(difficulty))) {
        nonce += 1;
    }
    return String(nonce);
}

async function getChallenge(): Promise<{ challenge: string; nonce: string }> {
    const { issueChallenge } = await import('@/lib/security/pow');
    const { challenge, difficulty } = issueChallenge();
    return { challenge, nonce: solveChallenge(challenge, difficulty) };
}

function buildRequest(url: string, body: unknown): NextRequest {
    return new NextRequest(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-csrf-token': CSRF_TOKEN,
            cookie: `jinjoo_csrf=${CSRF_TOKEN}`
        },
        body: JSON.stringify(body)
    });
}

describe('POST /api/posts', () => {
    it('never persists raw PII: a phone number re-added during edit is stripped before storage', async () => {
        const { challenge, nonce } = await getChallenge();
        const request = buildRequest('http://localhost/api/posts', {
            sanitizedText: '연락처는 010-9999-8888 로 남겨주세요.',
            mode: 'confess',
            visibility: 'private',
            website: '',
            challenge,
            nonce
        });

        const response = await createPost(request);
        expect(response.status).toBe(201);
        const body = (await response.json()) as { publicId: string; deleteKey: string; moderationStatus: string };

        const db = getDb();
        const rows = await db.select().from(posts).where(eq(posts.publicId, body.publicId));
        expect(rows).toHaveLength(1);
        expect(rows[0].sanitizedText).not.toContain('010-9999-8888');
        expect(rows[0].sanitizedText).toContain('[전화번호 삭제됨]');
    });

    it('never auto-publishes high-risk content requesting a public-facing visibility', async () => {
        const { challenge, nonce } = await getChallenge();
        const request = buildRequest('http://localhost/api/posts', {
            sanitizedText: '김철수 씨가 나를 성폭행했다.',
            mode: 'confess',
            visibility: 'public_review',
            website: '',
            challenge,
            nonce
        });

        const response = await createPost(request);
        expect(response.status).toBe(201);
        const body = (await response.json()) as { moderationStatus: string; riskLevel: string };
        expect(body.moderationStatus).toBe('pending');
        expect(['high', 'urgent']).toContain(body.riskLevel);
    });

    it('rejects requests without a valid CSRF token', async () => {
        const request = new NextRequest('http://localhost/api/posts', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ sanitizedText: 'x', mode: 'confess', visibility: 'private', website: '', challenge: 'a', nonce: '1' })
        });
        const response = await createPost(request);
        expect(response.status).toBe(403);
    });

    it('rejects a bot-filled honeypot field', async () => {
        const { challenge, nonce } = await getChallenge();
        const request = buildRequest('http://localhost/api/posts', {
            sanitizedText: '내용',
            mode: 'confess',
            visibility: 'private',
            website: 'http://spam.example',
            challenge,
            nonce
        });
        const response = await createPost(request);
        expect(response.status).toBe(400);
    });
});

describe('post lifecycle: react then delete via delete key', () => {
    it('deletes a post only when the correct delete key is supplied', async () => {
        const { challenge, nonce } = await getChallenge();
        const createRequest = buildRequest('http://localhost/api/posts', {
            sanitizedText: '삭제 키 테스트용 글입니다.',
            mode: 'confess',
            visibility: 'private',
            website: '',
            challenge,
            nonce
        });
        const createResponse = await createPost(createRequest);
        const created = (await createResponse.json()) as { publicId: string; deleteKey: string };

        const wrongDeleteRequest = buildRequest(`http://localhost/api/posts/${created.publicId}/delete`, { deleteKey: 'totally-wrong-key' });
        const wrongDeleteResponse = await deletePost(wrongDeleteRequest, { params: Promise.resolve({ shareId: created.publicId }) });
        expect(wrongDeleteResponse.status).toBe(403);

        const correctDeleteRequest = buildRequest(`http://localhost/api/posts/${created.publicId}/delete`, { deleteKey: created.deleteKey });
        const correctDeleteResponse = await deletePost(correctDeleteRequest, { params: Promise.resolve({ shareId: created.publicId }) });
        expect(correctDeleteResponse.status).toBe(200);

        const db = getDb();
        const rows = await db.select().from(posts).where(eq(posts.publicId, created.publicId));
        expect(rows).toHaveLength(0);
    });

    it('rejects reactions on posts pending moderation', async () => {
        const { challenge, nonce } = await getChallenge();
        const createRequest = buildRequest('http://localhost/api/posts', {
            sanitizedText: '너 진짜 죽여버릴 거야.',
            mode: 'confess',
            visibility: 'unlisted',
            website: '',
            challenge,
            nonce
        });
        const createResponse = await createPost(createRequest);
        const created = (await createResponse.json()) as { publicId: string; moderationStatus: string };
        expect(created.moderationStatus).toBe('pending');

        const reactRequest = buildRequest(`http://localhost/api/posts/${created.publicId}/react`, { reactionType: 'heard' });
        const reactResponse = await reactToPost(reactRequest, { params: Promise.resolve({ shareId: created.publicId }) });
        expect(reactResponse.status).toBe(404);
    });
});

describe('GET /api/admin/queue authorization', () => {
    it('rejects requests without a valid admin session', async () => {
        const request = new NextRequest('http://localhost/api/admin/queue', { headers: {} });
        const response = await adminQueue(request);
        expect(response.status).toBe(401);
    });

    it('accepts requests with a valid admin session cookie', async () => {
        const { token } = await createAdminSession();
        const request = new NextRequest('http://localhost/api/admin/queue', {
            headers: { cookie: `${ADMIN_SESSION_COOKIE}=${token}` }
        });
        const response = await adminQueue(request);
        expect(response.status).toBe(200);
    });
});
