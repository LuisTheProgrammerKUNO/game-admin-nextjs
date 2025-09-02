import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export async function GET() {
  const modules = await prisma.module.findMany({ orderBy: { module_id: 'asc' } })
  return NextResponse.json(modules)
}

export async function POST(req: Request) {
  const { name } = await req.json()
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })
  const mod = await prisma.module.create({ data: { name } })
  return NextResponse.json(mod, { status: 201 })
}
