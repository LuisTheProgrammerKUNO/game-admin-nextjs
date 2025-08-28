import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const rows = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }, // if you don’t have createdAt, drop this
    include: {
      users_sync: { select: { email: true, name: true } },
    },
  })

  // Shape the response the admin UI expects
  const out = rows.map(u => ({
    id: u.id,                                      // string
    username: u.users_sync?.name ?? `${u.first_name} ${u.last_name}`,
    email: u.users_sync?.email ?? null,
    requestDeletion: u.requestDeletion,
  }))

  return NextResponse.json(out, { headers: { 'Cache-Control': 'no-store' } })
}
