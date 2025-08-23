// src/app/api/answers/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'

type CreateAnswerBody = {
  question_id: number
  text: string
  is_correct?: boolean
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const questionIdParam = searchParams.get('question_id')

  const where = questionIdParam
    ? { question_id: Number(questionIdParam) }
    : undefined

  const answers = await prisma.answer.findMany({
    where,
    orderBy: { answer_id: 'asc' },
  })

  return NextResponse.json(answers)
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Narrow the type safely
  const b = body as Partial<CreateAnswerBody>
  if (
    typeof b?.question_id !== 'number' ||
    typeof b?.text !== 'string' ||
    b.text.trim() === ''
  ) {
    return NextResponse.json(
      { error: 'question_id (number) and text (string) are required' },
      { status: 400 }
    )
  }

  const created = await prisma.answer.create({
    data: {
      question_id: b.question_id,
      text: b.text,
      is_correct: Boolean(b.is_correct),
    },
  })

  return NextResponse.json(created, { status: 201 })
}
