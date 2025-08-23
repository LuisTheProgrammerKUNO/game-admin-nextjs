import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import type { Answer } from '@prisma/client'

type AnswerUpdate = Partial<Pick<Answer, 'text' | 'is_correct'>>

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const a = await prisma.answer.findUnique({ where: { answer_id: id } })
  return NextResponse.json(a)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const body = (await req.json().catch(() => ({}))) as Partial<Record<string, unknown>>

  const data: AnswerUpdate = {}
  if (typeof body.text === 'string') data.text = body.text
  if (typeof body.is_correct === 'boolean') data.is_correct = body.is_correct

  const updated = await prisma.answer.update({ where: { answer_id: id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  await prisma.answer.delete({ where: { answer_id: id } })
  return NextResponse.json({ ok: true })
}

