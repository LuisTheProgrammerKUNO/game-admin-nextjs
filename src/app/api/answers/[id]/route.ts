// src/app/api/answers/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import type { Answer } from '@prisma/client'

type AnswerUpdate = Partial<Pick<Answer, 'text' | 'is_correct'>>

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const answer = await prisma.answer.findUnique({
    where: { answer_id: Number(id) },
  })
  return NextResponse.json(answer)
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

  const data: AnswerUpdate = {}
  if (raw && typeof raw === 'object') {
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
