// src/app/api/admin/users/approve-deletion/route.ts
import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // 1️⃣ Look up user in users_sync by email
    const syncUser = await prisma.users_sync.findFirst({
      where: { email },
      select: { id: true },
    })

    if (!syncUser) {
      return NextResponse.json({ error: 'User not found in users_sync' }, { status: 404 })
    }

    // 2️⃣ Permanently delete from public.users
    await prisma.users.delete({
      where: { id: syncUser.id },
    })

    return NextResponse.json({
      ok: true,
      message: `User with email ${email} has been permanently deleted.`,
    })
  } catch (err: any) {
    console.error('Approve deletion error:', err)
    return NextResponse.json({ error: 'Failed to approve deletion' }, { status: 500 })
  }
}
