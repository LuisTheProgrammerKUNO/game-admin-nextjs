// src/app/api/request-deletion-route/route.ts
import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // 1️⃣ Find the user in users_sync
    const syncUser = await prisma.users_sync.findUnique({
      where: { email },
      select: { id: true },
    })

    if (!syncUser) {
      return NextResponse.json({ error: 'User not found in sync table' }, { status: 404 })
    }

    // 2️⃣ Update users table using the same id
    const updated = await prisma.users.update({
      where: { id: syncUser.id },
      data: { deletion_req: new Date() },
      select: { id: true, deletion_req: true },
    })

    return NextResponse.json({ ok: true, user: updated })
  } catch (err: any) {
    console.error('Request deletion error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
