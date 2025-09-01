import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

// PATCH = update user (toggle active, reset coins, cancel deletion, etc.)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const body = await req.json()

    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        ...(body.toggleActive !== undefined ? { is_active: !body.is_active } : {}),
        ...(body.resetCoins ? { coins: 0 } : {}),
        ...(body.cancelDeletion ? { deletion_req: null } : {}),
      },
    })

    return NextResponse.json(updatedUser)
  } catch (err: any) {
    console.error('Update user error:', err)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
