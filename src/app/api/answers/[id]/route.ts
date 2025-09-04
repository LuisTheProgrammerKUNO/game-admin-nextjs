import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { text, is_correct } = await req.json();

  if (!text || !text.trim()) {
    return NextResponse.json(
      { error: "Answer text is required" },
      { status: 400 }
    );
  }

  const answer = await prisma.answer.update({
    where: { answer_id: Number(id) },
    data: { text: text.trim(), is_correct: Boolean(is_correct) },
  });

  return NextResponse.json(answer);
}
