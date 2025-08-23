import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { QuestionType } from '@prisma/client'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const question = await prisma.question.findUnique({
    where: { question_id: id },
    include: { module: true, answers: true },
  })
  if (!question) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(question)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)

  type QuestionUpdate = Partial<{
    module_id: number
    type: QuestionType
    text: string
  }>

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const data: QuestionUpdate = {}

  if (typeof body.module_id === 'number') data.module_id = body.module_id
  if (typeof body.text === 'string') data.text = body.text
  if (
    typeof body.type === 'string' &&
    (Object.values(QuestionType) as string[]).includes(body.type)
  ) {
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
