// src/app/api/modules/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Quick sanity check
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params
  const moduleId = Number(id)
  const m = await prisma.module.findUnique({
    where: { module_id: moduleId },
    include: { questions: true },
  })
  return NextResponse.json(m, { headers: { 'Cache-Control': 'no-store' } })
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params
  const moduleId = Number(id)
  if (!Number.isFinite(moduleId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  await prisma.module.delete({ where: { module_id: moduleId } })
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
}
