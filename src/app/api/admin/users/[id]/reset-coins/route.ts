import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params

  try {
    const user = await prisma.users.findUnique({ where: { id } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updated = await prisma.users.update({
      where: { id },
      data: { coins: 0 },
    })

    return NextResponse.json(updated)
  } catch (e) {
    console.error('reset-coins failed:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
