import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function POST(req: Request) {
  const { question_id, text, is_correct } = await req.json();

  if (!question_id) {
    return NextResponse.json(
      { error: "question_id is required" },
      { status: 400 }
    );
  }
  if (!text || !text.trim()) {
    return NextResponse.json(
      { error: "Answer text is required" },
      { status: 400 }
    );
  }

  const answer = await prisma.answer.create({
    data: {
      question_id: Number(question_id),
      text: text.trim(),
      is_correct: Boolean(is_correct),
    },
  });

  return NextResponse.json(answer);
}
