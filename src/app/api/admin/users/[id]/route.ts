import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const id = params.id
  try {
    const body = await req.json().catch(() => ({} as any))

    const updated = await prisma.users.update({
      where: { id },
      data: {
        ...(body?.toggleActive ? { is_active: { set: undefined } } : {}), // we'll handle toggle below
        ...(body?.resetCoins ? { coins: 0 } : {}),
      },
    })

    if (body?.toggleActive) {
      await prisma.users.update({
        where: { id },
        data: { is_active: !updated.is_active },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('POST /api/admin/users/[id] error', err)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
