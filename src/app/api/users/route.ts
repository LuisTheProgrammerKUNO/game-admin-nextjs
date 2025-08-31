import { NextResponse } from 'next/server'
import prisma from '@lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const rows = await prisma.user.findMany({
    orderBy: { // newest activity first (uses public.users.updated_at if exists; else stable)
      id: 'asc',
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      middle_name: true,
      age: true,
      school: true,
      birthday: true,
      location: true,
      is_active: true,
      requestDeletion: true,           // from public.users.deletion_req
      users_sync: {                    // from neon_auth.users_sync (mirror)
        select: { email: true, name: true, created_at: true, updated_at: true },
      },
    },
  })

  // Optional: shape a flatter object for the UI
  const data = rows.map(u => ({
    id: u.id,
    name: u.users_sync?.name ?? `${u.first_name} ${u.last_name}`.trim(),
    email: u.users_sync?.email ?? null,
    first_name: u.first_name,
    last_name: u.last_name,
    middle_name: u.middle_name,
    age: u.age,
    school: u.school,
    birthday: u.birthday,
    location: u.location,
    is_active: u.is_active ?? true,
    requestDeletion: u.requestDeletion,
    createdAt: u.users_sync?.created_at ?? null,
    updatedAt: u.users_sync?.updated_at ?? null,
  }))

  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
}
