import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function POST(_req: Request, context: any) {
  const id = context?.params?.id as string
  if (!id) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  try {
    await prisma.users.update({
      where: { id },
      data: { deletion_req: null },
    })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Cancel deletion error:', err)
    return NextResponse.json({ error: 'Failed to cancel deletion' }, { status: 500 })
  }
}
