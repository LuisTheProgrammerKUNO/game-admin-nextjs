import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const qid = Number(searchParams.get('question_id') || 0)
  const where = qid ? { question_id: qid } : {}
  const items = await prisma.answer.findMany({ where, orderBy: { answer_id: 'asc' } })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const { question_id, text, is_correct } = await req.json()
  if (!question_id || !text) return NextResponse.json({ error: 'question_id, text required' }, { status: 400 })
  const item = await prisma.answer.create({ data: { question_id, text, is_correct: !!is_correct } })
  return NextResponse.json(item, { status: 201 })
}
