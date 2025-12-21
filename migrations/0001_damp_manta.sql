CREATE TABLE "dashboard_layout" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"layout" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dashboard_layout_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "dashboard_layout" ADD CONSTRAINT "dashboard_layout_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "dashboard_layout_userId_idx" ON "dashboard_layout" USING btree ("user_id");