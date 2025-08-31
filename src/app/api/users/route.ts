import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const rows = await prisma.users.findMany({
    select: {
      id: true,
      username: true,
      first_name: true,
      last_name: true,
      deletion_req: true,
      users_sync: { select: { email: true, name: true } },
    },
    orderBy: { id: 'asc' },
  })

  type Row = typeof rows[number] // ✅ no implicit any in .map below

  const data = rows.map((u: Row) => ({
    id: u.id,
    username: u.username,
    email: u.users_sync?.email ?? null,
    name: u.users_sync?.name ?? `${u.first_name} ${u.last_name}`.trim(),
    requestDeletion: u.deletion_req ? u.deletion_req.toISOString() : null,
  }))

  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
}
