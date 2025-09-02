import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  await prisma.module.delete({ where: { module_id: id } })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const { name } = await req.json()
  const mod = await prisma.module.update({ where: { module_id: id }, data: { name } })
  return NextResponse.json(mod)
}
