import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { text, is_correct } = await req.json()
    await prisma.answer.update({
      where: { answer_id: Number(params.id) },
      data: { text, is_correct },
    })

    const modules = await prisma.module.findMany({
      orderBy: { module_id: 'asc' },
      include: { questions: { include: { answers: true } } },
    })

    return NextResponse.json(modules)
  } catch (err) {
    console.error('Error updating answer:', err)
    return NextResponse.json({ error: 'Failed to update answer' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.answer.delete({ where: { answer_id: Number(params.id) } })

    const modules = await prisma.module.findMany({
      orderBy: { module_id: 'asc' },
      include: { questions: { include: { answers: true } } },
    })

    return NextResponse.json(modules)
  } catch (err) {
    console.error('Error deleting answer:', err)
    return NextResponse.json({ error: 'Failed to delete answer' }, { status: 500 })
  }
}
