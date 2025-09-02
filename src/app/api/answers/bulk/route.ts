import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

// Bulk create or update answers for a question
export async function POST(req: Request) {
    const { question_id, answers } = await req.json();
    // answers: [{ text: string, is_correct: boolean }, ...]

    // Clear old answers (if updating)
    await prisma.answer.deleteMany({
        where: { question_id },
    });

    // Insert new set of answers
    const created = await prisma.answer.createMany({
        data: answers.map((a: any) => ({
            question_id,
            text: a.text,
            is_correct: a.is_correct,
        })),
    });

    return NextResponse.json({ count: created.count });
}
