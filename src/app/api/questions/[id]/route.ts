import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const q = await prisma.question.findUnique({
    where: { question_id: Number(id) },
    include: { module: true, answers: true },
  });
  return NextResponse.json(q);
}
