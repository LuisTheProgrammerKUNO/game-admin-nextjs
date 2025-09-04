import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await prisma.module.delete({
      where: { module_id: Number(id) },
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Delete module error:", err);
    return NextResponse.json(
      { error: "Failed to delete module" },
      { status: 500 }
    );
  }
}
