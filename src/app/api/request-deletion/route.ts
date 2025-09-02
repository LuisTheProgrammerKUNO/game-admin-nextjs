import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    // users_sync.email is NOT unique → use findFirst
    const syncUser = await prisma.users_sync.findFirst({
      where: { email: { equals: email } },
      select: { id: true },
    })

    if (!syncUser) {
      return NextResponse.json({ error: 'User not found in sync table' }, { status: 404 })
    }

    await prisma.users.update({
      where: { id: syncUser.id },
      data: { deletion_req: new Date() },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('request-deletion error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
