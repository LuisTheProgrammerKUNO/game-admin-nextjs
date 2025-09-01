import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/request-deletion
// Body: { id: string }
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const id = typeof body?.id === 'string' ? body.id : null

    if (!id) {
      return NextResponse.json({ error: 'Invalid or missing id' }, { status: 400 })
    }

    const user = await prisma.users.update({
      where: { id },
      data: { deletion_req: new Date() }, // ✅ correct field from schema
      select: { id: true, username: true, deletion_req: true },
    })

    return NextResponse.json({
      ok: true,
      id: user.id,
      username: user.username,
      requestDeletion: user.deletion_req ? user.deletion_req.toISOString() : null,
    })
  } catch (err: any) {
    console.error('Error in /api/request-deletion:', err)
    return NextResponse.json({ error: 'Failed to request deletion' }, { status: 500 })
  }
}
