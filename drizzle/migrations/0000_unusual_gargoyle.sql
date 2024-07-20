CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(256) NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
