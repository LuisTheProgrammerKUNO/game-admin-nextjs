import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json(null);
  const q = await prisma.question.findUnique({
    where: { question_id: id },
    include: { module: true, answers: true },
  });
  return NextResponse.json(q);
}
