/*
  Warnings:

  - You are about to drop the `answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `modules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "modules_schema";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "neon_auth";

-- CreateEnum
CREATE TYPE "modules_schema"."QuestionType" AS ENUM ('mul_choice', 'fill_blank', 'identification');

-- DropForeignKey
ALTER TABLE "public"."answers" DROP CONSTRAINT "answers_question_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."questions" DROP CONSTRAINT "questions_module_id_fkey";

-- DropTable
DROP TABLE "public"."answers";

-- DropTable
DROP TABLE "public"."modules";

-- DropTable
DROP TABLE "public"."questions";

-- DropTable
DROP TABLE "public"."user";

-- DropEnum
DROP TYPE "public"."QuestionType";

-- CreateTable
CREATE TABLE "neon_auth"."users_sync" (
    "raw_json" JSONB NOT NULL,
    "id" TEXT NOT NULL DEFAULT (raw_json ->> 'id'::text),
    "name" TEXT DEFAULT (raw_json ->> 'display_name'::text),
    "email" TEXT DEFAULT (raw_json ->> 'primary_email'::text),
    "created_at" TIMESTAMPTZ(6) DEFAULT to_timestamp((trunc((((raw_json ->> 'signed_up_at_millis'::text))::bigint)::double precision) / 1000::double precision)),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "users_sync_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "school" TEXT,
    "birthday" DATE,
    "location" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "deletion_req" TIMESTAMPTZ(6),
    "stripe_customer_id" TEXT,
    "coins" INTEGER DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."processed_events" (
    "id" TEXT NOT NULL,

    CONSTRAINT "processed_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transactions" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "coins" INTEGER NOT NULL,
    "stripe_payment_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "product_id" TEXT,
    "product_name" TEXT,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules_schema"."modules" (
    "module_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("module_id")
);

-- CreateTable
CREATE TABLE "modules_schema"."questions" (
    "question_id" SERIAL NOT NULL,
    "module_id" INTEGER NOT NULL,
    "type" "modules_schema"."QuestionType" NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "modules_schema"."answers" (
    "answer_id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "text" VARCHAR(255) NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("answer_id")
);

-- CreateIndex
CREATE INDEX "users_sync_deleted_at_idx" ON "neon_auth"."users_sync"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "public"."users"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_stripe_payment_id_key" ON "public"."transactions"("stripe_payment_id");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "neon_auth"."users_sync"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "modules_schema"."questions" ADD CONSTRAINT "questions_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules_schema"."modules"("module_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modules_schema"."answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "modules_schema"."questions"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;
