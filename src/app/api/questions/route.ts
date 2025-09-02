// app/api/questions/route.ts
import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

// GET /api/questions → list all questions
export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      include: { module: true, answers: true },
    });
    return NextResponse.json(questions ?? []);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

// POST /api/questions → create a new question
export async function POST(req: Request) {
  try {
    const { module_id, type, text } = await req.json();

    if (!module_id || !type || !text) {
      return NextResponse.json(
        { error: "module_id, type, and text are required" },
        { status: 400 }
      );
    }

    const q = await prisma.question.create({
      data: { module_id, type, text },
    });

    return NextResponse.json(q, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Failed to create question" },
      { status: 500 }
    );
  }
}
