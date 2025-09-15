import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    const user = await prisma.users.findUnique({ where: { id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    await prisma.users.update({
      where: { id },
      data: { is_active: !user.is_active },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Toggle active failed:', err)
    return NextResponse.json({ error: 'Failed to toggle user status' }, { status: 500 })
  }
}
