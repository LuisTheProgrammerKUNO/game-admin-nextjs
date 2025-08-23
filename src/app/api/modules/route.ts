import { NextResponse } from 'next/server';
import prisma from '@lib/prisma';
export const runtime = 'nodejs';

export async function GET() {
  const data = await prisma.module.findMany({
    orderBy: { module_id: 'asc' },
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';

  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const created = await prisma.module.create({ data: { name } });
  return NextResponse.json(created, { status: 201 });
}
