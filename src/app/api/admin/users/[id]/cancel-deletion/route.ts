import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.users.update({
      where: { id: params.id },
      data: { deletion_req: null },
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('cancel-deletion error', err)
    return NextResponse.json({ error: 'Failed to cancel deletion' }, { status: 500 })
  }
}
