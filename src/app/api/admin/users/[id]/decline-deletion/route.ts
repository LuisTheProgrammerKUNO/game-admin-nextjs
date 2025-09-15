import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    await prisma.users.update({
      where: { id },
      data: { deletion_req: null, is_active: true }, // reset deletion + reactivate
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Decline deletion failed:', err)
    return NextResponse.json({ error: 'Failed to decline deletion' }, { status: 500 })
  }
}
