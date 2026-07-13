import { z } from 'zod';

export const MAX_TEXT_LENGTH = 4000;
export const MIN_TEXT_LENGTH = 1;

export const rawTextSchema = z
    .string()
    .trim()
    .min(MIN_TEXT_LENGTH, '내용을 입력해 주세요.')
    .max(MAX_TEXT_LENGTH, `${MAX_TEXT_LENGTH}자 이내로 입력해 주세요.`);

export const modeSchema = z.enum(['confess', 'ask_opinion', 'anonymous_say', 'propose_to_org']);
export const visibilitySchema = z.enum(['private', 'unlisted', 'inbox', 'public_review']);
export const reactionTypeSchema = z.enum(['heard', 'same_here', 'support', 'needs_help']);
export const reportReasonSchema = z.enum(['personal_data', 'defamation', 'impersonation', 'copyright', 'other']);
export const moderationActionSchema = z.enum(['approve', 'reject', 'hide', 'block', 'unblock']);

const antiAbuseFields = {
    website: z.string().max(0, '요청을 처리할 수 없습니다.').optional().default(''),
    challenge: z.string().min(1),
    nonce: z.string().min(1)
};

export const sanitizeRequestSchema = z.object({
    text: rawTextSchema,
    ...antiAbuseFields
});

export const createPostRequestSchema = z.object({
    sanitizedText: rawTextSchema,
    mode: modeSchema,
    visibility: visibilitySchema,
    targetRoomId: z.string().trim().min(1).max(30).optional(),
    ...antiAbuseFields
});

export const reactionRequestSchema = z.object({
    reactionType: reactionTypeSchema
});

export const deleteRequestSchema = z.object({
    deleteKey: z.string().trim().min(1).max(64)
});

export const reportRequestSchema = z.object({
    targetPostPublicId: z.string().trim().min(1).max(30),
    reason: reportReasonSchema,
    description: z.string().trim().min(1).max(2000),
    contactEmail: z.string().trim().email().max(200).optional().or(z.literal(''))
});

export const adminLoginRequestSchema = z.object({
    password: z.string().min(1).max(200)
});

export const moderationActionRequestSchema = z.object({
    action: moderationActionSchema,
    note: z.string().trim().max(300).optional()
});

export const roomKindSchema = z.enum(['personal_inbox', 'topic_inbox']);

export const createInboxRequestSchema = z.object({
    title: z.string().trim().max(80).optional(),
    kind: roomKindSchema.default('personal_inbox'),
    ...antiAbuseFields
});
