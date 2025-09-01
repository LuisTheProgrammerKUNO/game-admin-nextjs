import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const rows = await prisma.users.findMany({
    where: { deletion_req: { not: null } },
    orderBy: { deletion_req: 'desc' },
    select: {
      id: true,
      deletion_req: true,
      users_sync: { select: { email: true, name: true } },
      first_name: true,
      middle_name: true,
      last_name: true,
    },
  })

  const data = rows.map(u => ({
    id: u.id,
    username: u.users_sync?.name,
    email: u.users_sync?.email ?? null,
    name: `${u.first_name} ${u.middle_name ?? ''} ${u.last_name}`.trim(),
    requestDeletion: u.deletion_req,
  }))

  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
}
