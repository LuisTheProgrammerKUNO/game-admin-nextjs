import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function POST(req: Request) {
  try {
    const { module_id, type, text } = await req.json()
    if (!text?.trim()) {
      return NextResponse.json({ error: 'Question text required' }, { status: 400 })
    }

    await prisma.question.create({
      data: { module_id, type, text: text.trim() },
    })

    const modules = await prisma.module.findMany({
      orderBy: { module_id: 'asc' },
      include: { questions: { include: { answers: true } } },
    })

    return NextResponse.json(modules)
  } catch (err) {
    console.error('Error creating question:', err)
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 })
  }
}
