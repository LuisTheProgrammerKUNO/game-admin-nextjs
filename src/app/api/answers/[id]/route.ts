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
  const a = await prisma.answer.findUnique({
    where: { answer_id: id },
    select: { answer_id: true, question_id: true, text: true, is_correct: true },
  });
  return NextResponse.json(a);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const body = await req.json().catch(() => ({}));
  const data: { text?: string; is_correct?: boolean } = {};
  if (typeof body?.text === 'string') data.text = body.text;
  if (typeof body?.is_correct === 'boolean') data.is_correct = body.is_correct;
  const updated = await prisma.answer.update({ where: { answer_id: id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  await prisma.answer.delete({ where: { answer_id: id } });
  return NextResponse.json({ ok: true });
}
