import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  if (!id) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  await prisma.users.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
