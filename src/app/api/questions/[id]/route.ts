// app/api/questions/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@lib/prisma";

// GET /api/questions/:id → fetch one
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const q = await prisma.question.findUnique({
      where: { question_id: Number(params.id) },
      include: { module: true, answers: true },
    });

    if (!q) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json(q);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Failed to fetch question" },
      { status: 500 }
    );
  }
}

// PATCH /api/questions/:id → update question & answers
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { module_id, type, text, answers } = await req.json();

    const q = await prisma.question.update({
      where: { question_id: Number(params.id) },
      data: {
        module_id,
        type,
        text,
        ...(answers && {
          answers: {
            deleteMany: {}, // clear old answers
            create: answers.map((a: any) => ({
              text: a.text,
              is_correct: !!a.is_correct,
            })),
          },
        }),
      },
      include: { answers: true },
    });

    return NextResponse.json(q);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Failed to update question" },
      { status: 500 }
    );
  }
}

// DELETE /api/questions/:id → remove
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.question.delete({
      where: { question_id: Number(params.id) },
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Failed to delete question" },
      { status: 500 }
    );
  }
}
