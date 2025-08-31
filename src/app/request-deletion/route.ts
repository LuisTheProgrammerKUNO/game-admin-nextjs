import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}))
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'email required' }, { status: 400 })
  }

  // Find the user joined through the mirror
  const user = await prisma.user.findFirst({
    where: { users_sync: { email } },
    select: { id: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { requestDeletion: new Date() },
  })

  return NextResponse.json({ ok: true })
}
