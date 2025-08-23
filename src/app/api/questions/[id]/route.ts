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
  const body = (await req.json().catch(() => ({}))) as Partial<Record<string, unknown>>

  const data: QuestionUpdate = {}

  if (typeof body.text === 'string') data.text = body.text
  if (typeof body.module_id === 'number') data.module_id = body.module_id
  if (typeof body.type === 'string' && body.type in QuestionType) {
    data.type = body.type as QuestionType
  }

  const updated = await prisma.question.update({ where: { question_id: id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  await prisma.question.delete({ where: { question_id: id } })
  return NextResponse.json({ ok: true })
}

