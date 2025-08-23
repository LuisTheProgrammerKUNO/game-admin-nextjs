import { NextResponse } from 'next/server'
import prisma from '@lib/prisma';

export async function GET() {
  const items = await prisma.answer.findMany({ orderBy: { answer_id: 'asc' } })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}))
  const { question_id, text, is_correct } = b || {}
  if (!question_id || !text) {
    return NextResponse.json({ error: 'question_id and text required' }, { status: 400 })
  }
  const created = await prisma.answer.create({
    data: { question_id, text, is_correct: Boolean(is_correct) },
  })
  return NextResponse.json(created, { status: 201 })
}
