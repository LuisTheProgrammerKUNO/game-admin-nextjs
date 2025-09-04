import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // 1️⃣ Find the user in users_sync using email
    const syncUser = await prisma.users_sync.findFirst({
      where: { email },
      select: { id: true },
    })

    if (!syncUser) {
      return NextResponse.json({ error: 'User not found in users_sync' }, { status: 404 })
    }

    // 2️⃣ Clear deletion_req in public.users using the linked ID
    await prisma.users.update({
      where: { id: syncUser.id },
      data: { deletion_req: null },
    })

    return NextResponse.json({ ok: true, message: `Deletion request canceled for ${email}` })
  } catch (err: any) {
    console.error('Cancel deletion error:', err)
    return NextResponse.json({ error: 'Failed to cancel deletion' }, { status: 500 })
  }
}
