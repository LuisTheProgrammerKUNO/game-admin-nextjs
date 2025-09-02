import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.users.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('approve-deletion error', err)
    return NextResponse.json({ error: 'Failed to approve deletion' }, { status: 500 })
  }
}
