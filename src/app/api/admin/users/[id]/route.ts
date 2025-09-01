import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    // ⚠️ delete the user permanently
    await prisma.users.delete({
      where: { id },
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Approve deletion error:', err)
    return NextResponse.json({ error: 'Failed to approve deletion' }, { status: 500 })
  }
}
