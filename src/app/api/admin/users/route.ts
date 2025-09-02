import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        middle_name: true,
        school: true,
        birthday: true,
        location: true,
        is_active: true,
        deletion_req: true,
        stripe_customer_id: true,
        coins: true,
        users_sync: {
          select: {
            email: true,
            created_at: true, // signup date from sync
          },
        },
      },
    })

    const mapped = users.map((u) => ({
      ...u,
      email: u.users_sync?.email ?? null,
      created_at: u.users_sync?.created_at ?? null,
    }))

    return NextResponse.json(mapped)
  } catch (err: any) {
    console.error('Error fetching users:', err)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
