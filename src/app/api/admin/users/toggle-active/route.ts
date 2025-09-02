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

    // 2️⃣ Toggle is_active flag in users table
    const user = await prisma.users.findUnique({ where: { id: syncUser.id } })

    if (!user) {
      return NextResponse.json({ error: 'User not found in users table' }, { status: 404 })
    }

    await prisma.users.update({
      where: { id: syncUser.id },
      data: { is_active: !user.is_active },
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Toggle active error:', err)
    return NextResponse.json({ error: 'Failed to toggle user active status' }, { status: 500 })
  }
}
