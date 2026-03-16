CREATE TYPE "public"."diff_line_type" AS ENUM('added', 'removed', 'context');--> statement-breakpoint
CREATE TYPE "public"."feedback_severity" AS ENUM('critical', 'warning', 'good', 'info');--> statement-breakpoint
CREATE TYPE "public"."programming_language" AS ENUM('javascript', 'typescript', 'python', 'java', 'go', 'rust', 'cpp', 'csharp', 'php', 'ruby', 'swift', 'kotlin', 'sql', 'html', 'css', 'json', 'yaml', 'markdown', 'bash', 'other');--> statement-breakpoint
CREATE TYPE "public"."roast_mode" AS ENUM('full', 'light');--> statement-breakpoint
CREATE TABLE "code_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"language" "programming_language" NOT NULL,
	"roast_mode" "roast_mode" DEFAULT 'full' NOT NULL,
	"score" numeric(3, 1),
	"line_count" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diff_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"line_number" integer NOT NULL,
	"type" "diff_line_type" NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedbacks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"line_number" integer,
	"severity" "feedback_severity" NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "diff_lines" ADD CONSTRAINT "diff_lines_submission_id_code_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."code_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_submission_id_code_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."code_submissions"("id") ON DELETE cascade ON UPDATE no action;