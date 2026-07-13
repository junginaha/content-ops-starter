import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../src/lib/db/schema';
import { generateInternalId, generatePublicId, generateDeleteKey } from '../src/lib/security/ids';
import { hashSecret } from '../src/lib/security/password';

const DEMO_TAG = '[데모]';

async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL is not set');
    }
    const pool = new Pool({ connectionString });
    const db = drizzle(pool, { schema });

    console.log('Seeding clearly-labeled demo content...');

    const roomId = generateInternalId();
    const roomDeleteKey = generateDeleteKey();
    await db.insert(schema.rooms).values({
        id: roomId,
        publicId: generatePublicId(),
        kind: 'topic_inbox',
        title: `${DEMO_TAG} 사내 문화 개선 제안함`,
        ownerDeleteKeyHash: await hashSecret(roomDeleteKey)
    });

    const demoPosts: Array<{ mode: (typeof schema.modeEnum.enumValues)[number]; visibility: (typeof schema.visibilityEnum.enumValues)[number]; text: string; risk: (typeof schema.riskLevelEnum.enumValues)[number]; status: (typeof schema.moderationStatusEnum.enumValues)[number]; roomId?: string }> = [
        {
            mode: 'confess',
            visibility: 'public_review',
            text: `${DEMO_TAG} 늘 괜찮은 척했지만 사실 요즘 많이 지쳐 있었다는 걸 오늘 처음 스스로 인정했다.`,
            risk: 'low',
            status: 'approved'
        },
        {
            mode: 'ask_opinion',
            visibility: 'public_review',
            text: `${DEMO_TAG} 팀 회의를 매일 하는 것과 주 2회로 줄이는 것, 어느 쪽이 더 나을까요? 다들 어떻게 생각하는지 궁금합니다.`,
            risk: 'low',
            status: 'approved'
        },
        {
            mode: 'propose_to_org',
            visibility: 'inbox',
            text: `${DEMO_TAG} 회의실 예약 시스템이 너무 불편합니다. 예약 현황을 한눈에 볼 수 있는 화면이 있으면 좋겠어요.`,
            risk: 'low',
            status: 'auto_approved',
            roomId
        },
        {
            mode: 'anonymous_say',
            visibility: 'unlisted',
            text: `${DEMO_TAG} [이름] 님께 그동안 감사했다는 말을 하지 못했어요. [소속 삭제됨]에서 함께한 시간이 제겐 큰 힘이 되었습니다.`,
            risk: 'medium',
            status: 'auto_approved'
        },
        {
            mode: 'confess',
            visibility: 'public_review',
            text: `${DEMO_TAG} 그 사람이 나에게 [강한 표현]이라고 말했을 때 정말 상처받았다. 그래도 지금은 괜찮아지려고 노력 중이다.`,
            risk: 'high',
            status: 'pending'
        }
    ];

    for (const demo of demoPosts) {
        const postId = generateInternalId();
        const deleteKey = generateDeleteKey();
        await db.insert(schema.posts).values({
            id: postId,
            publicId: generatePublicId(),
            roomId: demo.roomId ?? null,
            mode: demo.mode,
            visibility: demo.visibility,
            sanitizedText: demo.text,
            riskLevel: demo.risk,
            issueTypes: demo.risk === 'low' ? [] : ['sensitive_disclosure'],
            moderationStatus: demo.status,
            deleteKeyHash: await hashSecret(deleteKey)
        });

        await db.insert(schema.reactions).values(
            (['heard', 'same_here', 'support', 'needs_help'] as const).map((reactionType) => ({
                id: generateInternalId(),
                postId,
                reactionType,
                count: Math.floor(Math.random() * 6)
            }))
        );

        await db.insert(schema.moderationEvents).values({
            id: generateInternalId(),
            postId,
            action: 'auto_flag',
            riskLevelAtEvent: demo.risk,
            actor: 'system',
            note: demo.status
        });
    }

    console.log('Seed complete. Demo content is prefixed with "[데모]" for easy identification.');
    await pool.end();
}

main().catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
});
