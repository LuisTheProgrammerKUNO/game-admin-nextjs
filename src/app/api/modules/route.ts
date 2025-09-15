import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function GET() {
  try {
    const modules = await prisma.module.findMany({
      orderBy: { module_id: 'asc' },
      include: {
        questions: {
          orderBy: { question_id: 'asc' },
          include: {
            answers: { orderBy: { answer_id: 'asc' } },
          },
        },
      },
    })
    return NextResponse.json(modules)
  } catch (err) {
    console.error('Error fetching modules:', err)
    return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json()
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Module name required' }, { status: 400 })
    }

    await prisma.module.create({ data: { name: name.trim() } })

    // return full updated modules tree
    const modules = await prisma.module.findMany({
      orderBy: { module_id: 'asc' },
      include: { questions: { include: { answers: true } } },
    })

    return NextResponse.json(modules)
  } catch (err) {
    console.error('Error creating module:', err)
    return NextResponse.json({ error: 'Failed to create module' }, { status: 500 })
  }
}
