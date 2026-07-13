import 'dotenv/config';
import { and, isNotNull, lt } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../src/lib/db/schema';

const MODERATION_EVENT_RETENTION_MS = 180 * 24 * 60 * 60 * 1000; // 180 days

async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL is not set');
    }
    const pool = new Pool({ connectionString });
    const db = drizzle(pool, { schema });

    const now = new Date();

    const expiredPosts = await db
        .delete(schema.posts)
        .where(and(isNotNull(schema.posts.expiresAt), lt(schema.posts.expiresAt, now)))
        .returning({ id: schema.posts.id });
    console.log(`Deleted ${expiredPosts.length} expired private/unlisted post(s).`);

    const oldEvents = await db
        .delete(schema.moderationEvents)
        .where(lt(schema.moderationEvents.createdAt, new Date(now.getTime() - MODERATION_EVENT_RETENTION_MS)))
        .returning({ id: schema.moderationEvents.id });
    console.log(`Deleted ${oldEvents.length} moderation event record(s) older than 180 days.`);

    const expiredSessions = await db
        .delete(schema.adminSessions)
        .where(lt(schema.adminSessions.expiresAt, now))
        .returning({ id: schema.adminSessions.id });
    console.log(`Deleted ${expiredSessions.length} expired admin session(s).`);

    await pool.end();
}

main().catch((error) => {
    console.error('Retention job failed:', error);
    process.exit(1);
});
