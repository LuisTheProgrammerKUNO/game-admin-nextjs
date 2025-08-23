import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import type { Question } from '@prisma/client'

type QuestionUpdate = Partial<Pick<Question, 'module_id' | 'type' | 'text'>>

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const q = await prisma.question.findUnique({
    where: { question_id: Number(id) },
    include: { answers: true, module: true },
  })
  return NextResponse.json(q)
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const data: QuestionUpdate = {}
  if (raw && typeof raw === 'object') {
    const r = raw as Record<string, unknown>
    if (typeof r.module_id === 'number') data.module_id = r.module_id
    if (typeof r.type === 'string') data.type = r.type as Question['type']
    if (typeof r.text === 'string') data.text = r.text
  }

  const updated = await prisma.question.update({
    where: { question_id: Number(id) },
    data,
  })
  return NextResponse.json(updated)
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  await prisma.question.delete({ where: { question_id: Number(id) } })
  return NextResponse.json({ ok: true })
}
