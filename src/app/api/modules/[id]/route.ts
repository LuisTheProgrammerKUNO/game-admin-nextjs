import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/modules/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const moduleId = Number(params.id);
  if (!Number.isFinite(moduleId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const m = await prisma.module.findUnique({
    where: { module_id: moduleId },
    include: { questions: true },
  });
  return NextResponse.json(m, { headers: { 'Cache-Control': 'no-store' } });
}

// PUT /api/modules/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const moduleId = Number(params.id);
  if (!Number.isFinite(moduleId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const body = await req.json().catch(() => ({}));
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  const updated = await prisma.module.update({
    where: { module_id: moduleId },
    data: { name },
  });
  return NextResponse.json(updated, { headers: { 'Cache-Control': 'no-store' } });
}

// DELETE /api/modules/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const moduleId = Number(params.id);
  if (!Number.isFinite(moduleId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  await prisma.module.delete({ where: { module_id: moduleId } });
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
