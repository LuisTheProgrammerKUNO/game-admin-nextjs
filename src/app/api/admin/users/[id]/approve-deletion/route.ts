import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params

  try {
    const user = await prisma.users.findUnique({ where: { id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // "Approve" = deactivate and clear the request flag
    const updated = await prisma.users.update({
      where: { id },
      data: { is_active: false, deletion_req: null },
    })

    return NextResponse.json(updated)
  } catch (e) {
    console.error('approve-deletion failed:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
