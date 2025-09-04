import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function GET() {
  try {
    const modules = await prisma.module.findMany({
      orderBy: { module_id: "asc" },
      include: {
        questions: {
          orderBy: { question_id: "asc" },
          include: { answers: { orderBy: { answer_id: "asc" } } },
        },
      },
    });

    return NextResponse.json(modules);
  } catch (error: any) {
    console.error("❌ Error fetching modules:", error);
    return NextResponse.json(
      { error: "Failed to fetch modules" },
      { status: 500 }
    );
  }
}
