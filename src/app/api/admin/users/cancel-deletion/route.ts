import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }

    // 1️⃣ Find the user in users_sync by email
    const syncUser = await prisma.users_sync.findFirst({
      where: { email },
      select: { id: true },
    })

    if (!syncUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 2️⃣ Reset deletion_req in users table
    await prisma.users.update({
      where: { id: syncUser.id },
      data: { deletion_req: null },
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Cancel deletion error:', err)
    return NextResponse.json({ error: 'Failed to cancel deletion' }, { status: 500 })
  }
}
