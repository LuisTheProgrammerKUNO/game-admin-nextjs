import { NextResponse } from 'next/server';
import prisma from '@lib/prisma';


export const runtime = 'nodejs';

function toId(id: string) {
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const module_id = toId(params.id);
  if (!module_id) return NextResponse.json({ error: 'invalid id' }, { status: 400 });

  const data = await prisma.module.findUnique({
    where: { module_id },
    include: {
      // quick glance at related content
      _count: { select: { questions: true } },
    },
  });

  if (!data) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const module_id = toId(params.id);
  if (!module_id) return NextResponse.json({ error: 'invalid id' }, { status: 400 });

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';

  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const updated = await prisma.module.update({
    where: { module_id },
    data: { name },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const module_id = toId(params.id);
  if (!module_id) return NextResponse.json({ error: 'invalid id' }, { status: 400 });

  await prisma.module.delete({ where: { module_id } });
  return NextResponse.json({ ok: true });
}
