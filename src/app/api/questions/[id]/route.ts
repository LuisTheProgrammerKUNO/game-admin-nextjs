import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { type, text } = await req.json()
    await prisma.question.update({
      where: { question_id: Number(params.id) },
      data: { type, text },
    })

    const modules = await prisma.module.findMany({
      orderBy: { module_id: 'asc' },
      include: { questions: { include: { answers: true } } },
    })

    return NextResponse.json(modules)
  } catch (err) {
    console.error('Error updating question:', err)
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.question.delete({ where: { question_id: Number(params.id) } })

    const modules = await prisma.module.findMany({
      orderBy: { module_id: 'asc' },
      include: { questions: { include: { answers: true } } },
    })

    return NextResponse.json(modules)
  } catch (err) {
    console.error('Error deleting question:', err)
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 })
  }
}
