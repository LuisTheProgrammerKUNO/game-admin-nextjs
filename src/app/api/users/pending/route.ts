//List pending deletion requests

import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const rows = await prisma.user.findMany({
    where: { requestDeletion: { not: null } },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, username: true, email: true, requestDeletion: true },
  })
  return NextResponse.json(rows, { headers: { 'Cache-Control': 'no-store' } })
}
