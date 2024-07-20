DO $$ BEGIN
 CREATE TYPE "public"."userRole" AS ENUM('ADMIN', 'CLIENT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categoryTable" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "postTables" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"averageRating" real DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"authorId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "postTocategory" (
	"postId" uuid NOT NULL,
	"categoryId" uuid NOT NULL,
	CONSTRAINT "postTocategory_postId_categoryId_pk" PRIMARY KEY("postId","categoryId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userPreferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"emailUpdates" boolean DEFAULT false NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "age" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "userRole" "userRole" DEFAULT 'CLIENT' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "postTables" ADD CONSTRAINT "postTables_authorId_user_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "postTocategory" ADD CONSTRAINT "postTocategory_postId_postTables_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."postTables"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "postTocategory" ADD CONSTRAINT "postTocategory_categoryId_categoryTable_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categoryTable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userPreferences" ADD CONSTRAINT "userPreferences_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
