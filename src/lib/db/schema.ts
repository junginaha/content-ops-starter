import { pgTable, text, timestamp, integer, boolean, jsonb, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core';

export const riskLevelEnum = pgEnum('risk_level', ['low', 'medium', 'high', 'urgent']);
export const modeEnum = pgEnum('post_mode', ['confess', 'ask_opinion', 'anonymous_say', 'propose_to_org']);
export const visibilityEnum = pgEnum('visibility', ['private', 'unlisted', 'inbox', 'public_review']);
export const moderationStatusEnum = pgEnum('moderation_status', ['auto_approved', 'pending', 'approved', 'rejected', 'hidden', 'blocked']);
export const roomKindEnum = pgEnum('room_kind', ['personal_inbox', 'topic_inbox']);
export const moderationActionEnum = pgEnum('moderation_action', ['auto_flag', 'approve', 'reject', 'hide', 'block', 'unblock']);
export const reactionTypeEnum = pgEnum('reaction_type', ['heard', 'same_here', 'support', 'needs_help']);
export const reportReasonEnum = pgEnum('report_reason', ['personal_data', 'defamation', 'impersonation', 'copyright', 'other']);
export const reportStatusEnum = pgEnum('report_status', ['open', 'reviewing', 'resolved', 'dismissed']);

export const rooms = pgTable('rooms', {
    id: text('id').primaryKey(),
    publicId: text('public_id').notNull(),
    kind: roomKindEnum('kind').notNull(),
    title: text('title'),
    ownerDeleteKeyHash: text('owner_delete_key_hash').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true })
}, (table) => ({
    publicIdIdx: uniqueIndex('rooms_public_id_idx').on(table.publicId)
}));

export const posts = pgTable('posts', {
    id: text('id').primaryKey(),
    publicId: text('public_id').notNull(),
    roomId: text('room_id').references(() => rooms.id, { onDelete: 'cascade' }),
    mode: modeEnum('mode').notNull(),
    visibility: visibilityEnum('visibility').notNull(),
    sanitizedText: text('sanitized_text').notNull(),
    riskLevel: riskLevelEnum('risk_level').notNull(),
    issueTypes: jsonb('issue_types').$type<string[]>().notNull().default([]),
    moderationStatus: moderationStatusEnum('moderation_status').notNull().default('auto_approved'),
    deleteKeyHash: text('delete_key_hash').notNull(),
    aiDisclosed: boolean('ai_disclosed').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true })
}, (table) => ({
    publicIdIdx: uniqueIndex('posts_public_id_idx').on(table.publicId)
}));

export const reactions = pgTable('reactions', {
    id: text('id').primaryKey(),
    postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    reactionType: reactionTypeEnum('reaction_type').notNull(),
    count: integer('count').notNull().default(0),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
    postReactionIdx: uniqueIndex('reactions_post_type_idx').on(table.postId, table.reactionType)
}));

export const moderationEvents = pgTable('moderation_events', {
    id: text('id').primaryKey(),
    postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    action: moderationActionEnum('action').notNull(),
    riskLevelAtEvent: riskLevelEnum('risk_level_at_event').notNull(),
    actor: text('actor').notNull(),
    note: text('note'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const rightsReports = pgTable('rights_reports', {
    id: text('id').primaryKey(),
    publicId: text('public_id').notNull(),
    targetPostPublicId: text('target_post_public_id').notNull(),
    reason: reportReasonEnum('reason').notNull(),
    description: text('description').notNull(),
    contactEmail: text('contact_email'),
    status: reportStatusEnum('status').notNull().default('open'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    resolvedAt: timestamp('resolved_at', { withTimezone: true })
}, (table) => ({
    publicIdIdx: uniqueIndex('rights_reports_public_id_idx').on(table.publicId)
}));

export const adminSessions = pgTable('admin_sessions', {
    id: text('id').primaryKey(),
    tokenHash: text('token_hash').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
}, (table) => ({
    tokenHashIdx: uniqueIndex('admin_sessions_token_hash_idx').on(table.tokenHash)
}));
