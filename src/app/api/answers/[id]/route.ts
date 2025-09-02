import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { is_correct, text } = await req.json()
  const item = await prisma.answer.update({
    where: { answer_id: Number(params.id) },
    data: { ...(text !== undefined && { text }), ...(is_correct !== undefined && { is_correct }) },
  })
  return NextResponse.json(item)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.answer.delete({ where: { answer_id: Number(params.id) } })
  return NextResponse.json({ ok: true })
}
