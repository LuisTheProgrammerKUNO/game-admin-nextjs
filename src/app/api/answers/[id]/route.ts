import { NextResponse } from 'next/server'
import prisma from '@lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)

  const answer = await prisma.answer.findUnique({
    where: { answer_id: id },
    include: { question: true }, // optional: shows which question this belongs to
  })

  if (!answer) {
    return NextResponse.json({ error: 'Answer not found' }, { status: 404 })
  }

  return NextResponse.json(answer)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const b = await req.json().catch(() => ({}))
  const data: any = {}
  if (b?.text !== undefined) data.text = b.text
  if (b?.is_correct !== undefined) data.is_correct = Boolean(b.is_correct)
  const updated = await prisma.answer.update({ where: { answer_id: id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  await prisma.answer.delete({ where: { answer_id: id } })
  return NextResponse.json({ ok: true })
}
