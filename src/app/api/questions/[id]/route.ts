import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const q = await prisma.question.findUnique({
    where: { question_id: Number(id) },
    include: { module: true, answers: true },
  });
  return NextResponse.json(q);
}
