import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import type { Answer } from '@prisma/client'

// GET /api/answers/[id]
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const answer = await prisma.answer.findUnique({ where: { answer_id: id } })
  if (!answer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(answer)
}

// PUT /api/answers/[id]
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)

  // Only allow updating these fields
  type AnswerUpdate = Partial<Pick<Answer, 'text' | 'is_correct'>>

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const data: AnswerUpdate = {}

  if (typeof body.text === 'string') data.text = body.text
  if (typeof body.is_correct === 'boolean') data.is_correct = body.is_correct

  const updated = await prisma.answer.update({ where: { answer_id: id }, data })
  return NextResponse.json(updated)
}

// DELETE /api/answers/[id]
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  await prisma.answer.delete({ where: { answer_id: id } })
  return NextResponse.json({ ok: true })
}
