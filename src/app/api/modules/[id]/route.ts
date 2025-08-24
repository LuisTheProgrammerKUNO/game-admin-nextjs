import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/modules/[id]
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const moduleId = Number(id)
  if (!Number.isFinite(moduleId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const m = await prisma.module.findUnique({
    where: { module_id: moduleId },
    include: { questions: true },
  })

  return NextResponse.json(m, { headers: { 'Cache-Control': 'no-store' } })
}

// PUT /api/modules/[id]  (rename module)
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const moduleId = Number(id)
  if (!Number.isFinite(moduleId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const body = await req.json().catch(() => ({}))
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  const updated = await prisma.module.update({
    where: { module_id: moduleId },
    data: { name },
  })
  return NextResponse.json(updated, { headers: { 'Cache-Control': 'no-store' } })
}

// DELETE /api/modules/[id]
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const moduleId = Number(id)
  if (!Number.isFinite(moduleId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  try {
    await prisma.module.delete({ where: { module_id: moduleId } })
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e: any) {
    // If ON DELETE CASCADE is not in the DB yet, deletes will fail when questions/answers exist.
    return NextResponse.json(
      { error: e?.message ?? 'Delete failed' },
      { status: 500 }
    )
  }
}
