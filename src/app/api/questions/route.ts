import { NextResponse } from 'next/server'
import prisma from '@lib/prisma';
import { QuestionType } from '@prisma/client'

export async function GET() {
  const items = await prisma.question.findMany({
    orderBy: { question_id: 'asc' },
    include: { module: true, answers: true },
  })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}))
  const { module_id, type, text } = b || {}
  if (!module_id || !text || !type) {
    return NextResponse.json({ error: 'module_id, type, text required' }, { status: 400 })
  }
  if (!Object.values(QuestionType).includes(type)) {
    return NextResponse.json({ error: `type must be one of ${Object.values(QuestionType).join(', ')}` }, { status: 400 })
  }
  const created = await prisma.question.create({ data: { module_id, type, text } })
  return NextResponse.json(created, { status: 201 })
}
