//Approve delete (hard-delete user, but only if they requested deletion)

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// DELETE /api/users/[id] -> hard-delete ONLY if requestDeletion is set
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const userId = Number(id)
  if (!Number.isFinite(userId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, requestDeletion: true },
    })
    if (!user) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    if (!user.requestDeletion) {
      return NextResponse.json(
        { error: 'User has no pending deletion request' },
        { status: 409 }
      )
    }

    await prisma.user.delete({ where: { id: userId } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Delete failed' }, { status: 500 })
  }
}
