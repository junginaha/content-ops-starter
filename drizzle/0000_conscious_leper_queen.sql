CREATE TYPE "public"."post_mode" AS ENUM('confess', 'ask_opinion', 'anonymous_say', 'propose_to_org');--> statement-breakpoint
CREATE TYPE "public"."moderation_action" AS ENUM('auto_flag', 'approve', 'reject', 'hide', 'block', 'unblock');--> statement-breakpoint
CREATE TYPE "public"."moderation_status" AS ENUM('auto_approved', 'pending', 'approved', 'rejected', 'hidden', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."reaction_type" AS ENUM('heard', 'same_here', 'support', 'needs_help');--> statement-breakpoint
CREATE TYPE "public"."report_reason" AS ENUM('personal_data', 'defamation', 'impersonation', 'copyright', 'other');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('open', 'reviewing', 'resolved', 'dismissed');--> statement-breakpoint
CREATE TYPE "public"."risk_level" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."room_kind" AS ENUM('personal_inbox', 'topic_inbox');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('private', 'unlisted', 'inbox', 'public_review');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"token_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "moderation_events" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"action" "moderation_action" NOT NULL,
	"risk_level_at_event" "risk_level" NOT NULL,
	"actor" text NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"public_id" text NOT NULL,
	"room_id" text,
	"mode" "post_mode" NOT NULL,
	"visibility" "visibility" NOT NULL,
	"sanitized_text" text NOT NULL,
	"risk_level" "risk_level" NOT NULL,
	"issue_types" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"moderation_status" "moderation_status" DEFAULT 'auto_approved' NOT NULL,
	"delete_key_hash" text NOT NULL,
	"ai_disclosed" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reactions" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"reaction_type" "reaction_type" NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rights_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"public_id" text NOT NULL,
	"target_post_public_id" text NOT NULL,
	"reason" "report_reason" NOT NULL,
	"description" text NOT NULL,
	"contact_email" text,
	"status" "report_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rooms" (
	"id" text PRIMARY KEY NOT NULL,
	"public_id" text NOT NULL,
	"kind" "room_kind" NOT NULL,
	"title" text,
	"owner_delete_key_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moderation_events" ADD CONSTRAINT "moderation_events_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reactions" ADD CONSTRAINT "reactions_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "admin_sessions_token_hash_idx" ON "admin_sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "posts_public_id_idx" ON "posts" USING btree ("public_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "reactions_post_type_idx" ON "reactions" USING btree ("post_id","reaction_type");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "rights_reports_public_id_idx" ON "rights_reports" USING btree ("public_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "rooms_public_id_idx" ON "rooms" USING btree ("public_id");