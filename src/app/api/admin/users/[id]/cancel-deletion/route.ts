import { NextResponse } from "next/server"
import prisma from "@lib/prisma"

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const updated = await prisma.users.update({
      where: { id },
      data: { deletion_req: null },
      select: { id: true, deletion_req: true },
    })

    return NextResponse.json({ ok: true, user: updated })
  } catch (err: any) {
    console.error("Admin cancel deletion error:", err)
    return NextResponse.json({ error: "Failed to cancel deletion" }, { status: 500 })
  }
}
