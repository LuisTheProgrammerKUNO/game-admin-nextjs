import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function GET() {
  try {
    // Base info from public.users
    const users = await prisma.users.findMany({
      orderBy: { first_name: 'asc' },
    })

    if (users.length === 0) return NextResponse.json([])

    // Enrich with email + created_at from neon_auth.users_sync
    const ids = users.map(u => u.id)
    const mirrors = await prisma.users_sync.findMany({
      where: { id: { in: ids } },
      select: { id: true, email: true, created_at: true },
    })
    const mirrorMap = new Map(mirrors.map(m => [m.id, m]))

    const merged = users.map(u => ({
      ...u,
      email: mirrorMap.get(u.id)?.email ?? null,
      created_at: mirrorMap.get(u.id)?.created_at ?? null,
    }))

    return NextResponse.json(merged)
  } catch (e) {
    console.error('GET /api/admin/users failed:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
