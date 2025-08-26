-- CreateTable
CREATE TABLE "public"."user" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "displayName" TEXT,
    "gender" TEXT,
    "birthday" TEXT,
    "avatar" BYTEA,
    "avatarUrl" TEXT,
    "role" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "requestDeletion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "public"."user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");
