import { NextResponse } from 'next/server'
import prisma from '@lib/prisma';
import { QuestionType } from '@prisma/client'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const item = await prisma.question.findUnique({
    where: { question_id: id },
    include: { module: true, answers: true },
  })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const b = await req.json().catch(() => ({}))
  const data: any = {}
  if (b?.text) data.text = b.text
  if (b?.module_id) data.module_id = b.module_id
  if (b?.type) {
    if (!Object.values(QuestionType).includes(b.type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
    data.type = b.type
  }
  const updated = await prisma.question.update({ where: { question_id: id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  await prisma.question.delete({ where: { question_id: id } })
  return NextResponse.json({ ok: true })
}
