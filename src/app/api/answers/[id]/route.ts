import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import type { Answer } from '@prisma/client'

type AnswerUpdate = Partial<Pick<Answer, 'text' | 'is_correct'>>

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const a = await prisma.answer.findUnique({ where: { answer_id: id } })
  return NextResponse.json(a)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const raw = (await req.json().catch(() => ({}))) as unknown

  const data: AnswerUpdate = {}
  if (typeof raw === 'object' && raw !== null) {
    const r = raw as Record<string, unknown>
    if (typeof r.text === 'string') data.text = r.text
    if (typeof r.is_correct === 'boolean') data.is_correct = r.is_correct
  }

  const updated = await prisma.answer.update({ where: { answer_id: id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  await prisma.answer.delete({ where: { answer_id: id } })
  return NextResponse.json({ ok: true })
}
