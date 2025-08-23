-- CreateEnum
CREATE TYPE "public"."QuestionType" AS ENUM ('mcq', 'fill_blank', 'identification');

-- CreateTable
CREATE TABLE "public"."modules" (
    "module_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("module_id")
);

-- CreateTable
CREATE TABLE "public"."questions" (
    "question_id" SERIAL NOT NULL,
    "module_id" INTEGER NOT NULL,
    "type" "public"."QuestionType" NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "public"."answers" (
    "answer_id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "text" VARCHAR(255) NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("answer_id")
);

-- AddForeignKey
ALTER TABLE "public"."questions" ADD CONSTRAINT "questions_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("module_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;
