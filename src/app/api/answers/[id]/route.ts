import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const a = await prisma.answer.findUnique({
    where: { answer_id: Number(id) },
    select: { answer_id: true, question_id: true, text: true, is_correct: true },
  });
  return NextResponse.json(a);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json().catch(() => ({}));
  const data: { text?: string; is_correct?: boolean } = {};
  if (typeof body?.text === 'string') data.text = body.text;
  if (typeof body?.is_correct === 'boolean') data.is_correct = body.is_correct;
  const updated = await prisma.answer.update({ where: { answer_id: Number(id) }, data });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await prisma.answer.delete({ where: { answer_id: Number(id) } });
  return NextResponse.json({ ok: true });
}
