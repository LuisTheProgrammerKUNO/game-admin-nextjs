// prisma/seed.ts
import { PrismaClient, QuestionType } from '@prisma/client';

const prisma = new PrismaClient();

export default async function main() {
  console.log('🌱 Seeding database…');

  // Wipe tables in FK-safe order
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.module.deleteMany();

  // 1) Modules
  const created = await prisma.module.createMany({
    data: [
      { name: 'Module 1' },
      { name: 'Module 2' },
      { name: 'Module 3' },
      { name: 'Module 4' },
      { name: 'Module 5' },
      { name: 'Module 6' },
    ],
  });
  console.log(`✅ Created ${created.count} modules`);

  // Fetch modules to get their IDs
  const modules = await prisma.module.findMany({ orderBy: { module_id: 'asc' } });
  if (modules.length < 3) {
    throw new Error('Expected at least 3 modules to be created.');
  }
  const [m1, m2, m3] = modules;

  // 2) Questions
  const q1 = await prisma.question.create({
    data: {
      module_id: m1.module_id,
      type: QuestionType.mul_choice, // ✅ correct enum
      text: 'Who is the most pogi?',
    },
  });

  const q2 = await prisma.question.create({
    data: {
      module_id: m2.module_id,
      type: QuestionType.fill_blank,
      text: 'The capital of France is _____.',
    },
  });

  const q3 = await prisma.question.create({
    data: {
      module_id: m3.module_id,
      type: QuestionType.identification,
      text: 'Identify the largest planet in our solar system.',
    },
  });

  console.log('✅ Created 3 questions');

  // 3) Answers for mul_choice question
  await prisma.answer.createMany({
    data: [
      { question_id: q1.question_id, text: 'ako1', is_correct: false },
      { question_id: q1.question_id, text: 'ako2', is_correct: true },
      { question_id: q1.question_id, text: 'ako3', is_correct: false },
    ],
  });

  console.log('✅ Added answers for mul_choice question');
  console.log('🎉 Seeding complete');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
