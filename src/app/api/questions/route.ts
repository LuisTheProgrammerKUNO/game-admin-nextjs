import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.question.delete({ where: { question_id: Number(params.id) } })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { module_id, type, text } = await req.json()
  const q = await prisma.question.update({
    where: { question_id: Number(params.id) },
    data: { module_id, type, text },
  })
  return NextResponse.json(q)
}
