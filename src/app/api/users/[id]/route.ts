import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function DELETE(_req: Request, context: any) {
  const id = context?.params?.id as string
  if (!id) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  try {
    await prisma.users.delete({
      where: { id },
    })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Delete error:', err)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
