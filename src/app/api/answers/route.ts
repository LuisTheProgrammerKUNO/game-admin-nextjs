import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import type { Answer } from '@prisma/client'

type AnswerUpdate = Partial<Pick<Answer, 'text' | 'is_correct'>>

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const a = await prisma.answer.findUnique({ where: { answer_id: Number(id) } })
  return NextResponse.json(a)
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const raw = (await req.json().catch(() => ({}))) as unknown

  const data: AnswerUpdate = {}
  if (typeof raw === 'object' && raw !== null) {
    const r = raw as Record<string, unknown>
    if (typeof r.text === 'string') data.text = r.text
    if (typeof r.is_correct === 'boolean') data.is_correct = r.is_correct
  }

  const updated = await prisma.answer.update({
    where: { answer_id: Number(id) },
    data,
  })
  return NextResponse.json(updated)
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  await prisma.answer.delete({ where: { answer_id: Number(id) } })
  return NextResponse.json({ ok: true })
}
