import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true, first_name: true, last_name: true, middle_name: true,
        school: true, birthday: true, location: true, is_active: true,
        deletion_req: true, coins: true, stripe_customer_id: true,
        users_sync: { select: { email: true, created_at: true } },
      },
      orderBy: { id: 'asc' },
    })

    const formatted = users.map(u => ({
      ...u,
      email: u.users_sync?.email ?? null,
      signup_at: u.users_sync?.created_at?.toISOString() ?? null,
    }))

    return NextResponse.json(formatted)
  } catch (err) {
    console.error('GET /api/admin/users error', err)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
