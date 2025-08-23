import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const m = await prisma.module.findUnique({
    where: { module_id: Number(id) },
    include: { questions: true },
  })
  return NextResponse.json(m)
}

/* similarly adjust PUT/DELETE signatures if present */
