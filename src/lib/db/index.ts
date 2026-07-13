import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

let pool: Pool | undefined;
let dbInstance: NodePgDatabase<typeof schema> | undefined;

export function getDb(): NodePgDatabase<typeof schema> {
    if (!dbInstance) {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            throw new Error('DATABASE_URL is not set');
        }
        pool = new Pool({ connectionString });
        dbInstance = drizzle(pool, { schema });
    }
    return dbInstance;
}

export type Database = NodePgDatabase<typeof schema>;
