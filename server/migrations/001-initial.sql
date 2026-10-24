CREATE TYPE "user_role" AS ENUM ('USER', 'ADMIN');

CREATE TABLE "user_profiles" (
    "id" BIGSERIAL NOT NULL,
    "firebase_uid" TEXT NOT NULL,
    "email" TEXT,
    "display_name" TEXT,
    "role" "user_role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_profiles_firebase_uid_key" ON "user_profiles"("firebase_uid");
CREATE UNIQUE INDEX "user_profiles_email_key" ON "user_profiles"("email");
