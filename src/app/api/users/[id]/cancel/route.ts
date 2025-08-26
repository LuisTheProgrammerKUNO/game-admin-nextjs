//Cancel deletion request (admin action)

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/users/[id]/cancel -> clears requestDeletion
export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const userId = Number(id)
  if (!Number.isFinite(userId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { requestDeletion: null },
    select: { id: true },
  })
  return NextResponse.json({ ok: true, id: updated.id })
}
