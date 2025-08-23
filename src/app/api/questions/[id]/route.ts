import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import type { Question } from '@prisma/client'
import { QuestionType } from '@prisma/client'

type QuestionUpdate = Partial<Pick<Question, 'module_id' | 'type' | 'text'>>

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const q = await prisma.question.findUnique({
    where: { question_id: id },
    include: { module: true, answers: true },
  })
  return NextResponse.json(q)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const raw = (await req.json().catch(() => ({}))) as unknown

  const data: QuestionUpdate = {}
  if (typeof raw === 'object' && raw !== null) {
    const r = raw as Record<string, unknown>
    if (typeof r.text === 'string') data.text = r.text
    if (typeof r.module_id === 'number') data.module_id = r.module_id
    if (typeof r.type === 'string' && r.type in QuestionType) {
      data.type = r.type as QuestionType
    }
  }

  const updated = await prisma.question.update({ where: { question_id: id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  await prisma.question.delete({ where: { question_id: id } })
  return NextResponse.json({ ok: true })
}

