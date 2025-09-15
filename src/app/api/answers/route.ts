import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function POST(req: Request) {
  try {
    const { question_id, text, is_correct } = await req.json()
    if (!text?.trim()) {
      return NextResponse.json({ error: 'Answer text required' }, { status: 400 })
    }

    await prisma.answer.create({
      data: { question_id, text: text.trim(), is_correct },
    })

    const modules = await prisma.module.findMany({
      orderBy: { module_id: 'asc' },
      include: { questions: { include: { answers: true } } },
    })

    return NextResponse.json(modules)
  } catch (err) {
    console.error('Error creating answer:', err)
    return NextResponse.json({ error: 'Failed to create answer' }, { status: 500 })
  }
}
