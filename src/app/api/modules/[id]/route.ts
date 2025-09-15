import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const module_id = Number(params.id)
  if (Number.isNaN(module_id)) {
    return NextResponse.json({ error: 'Invalid module id' }, { status: 400 })
  }

  const mod = await prisma.module.findUnique({
    where: { module_id },
    include: {
      questions: {
        orderBy: { question_id: 'asc' },
        include: { answers: { orderBy: { answer_id: 'asc' } } },
      },
    },
  })

  if (!mod) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(mod)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name } = await req.json()
    await prisma.module.update({
      where: { module_id: Number(params.id) },
      data: { name },
    })

    const modules = await prisma.module.findMany({
      orderBy: { module_id: 'asc' },
      include: { questions: { include: { answers: true } } },
    })

    return NextResponse.json(modules)
  } catch (err) {
    console.error('Error updating module:', err)
    return NextResponse.json({ error: 'Failed to update module' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.module.delete({ where: { module_id: Number(params.id) } })

    const modules = await prisma.module.findMany({
      orderBy: { module_id: 'asc' },
      include: { questions: { include: { answers: true } } },
    })

    return NextResponse.json(modules)
  } catch (err) {
    console.error('Error deleting module:', err)
    return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 })
  }
}
