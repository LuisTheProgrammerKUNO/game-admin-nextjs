import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

// PATCH = update user (activate/deactivate, reset coins, cancel deletion, etc.)
export async function PATCH(req: Request, context: any) {
  const id = context?.params?.id as string;
  if (!id) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  try {
    const body = await req.json();

    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        ...(body.is_active !== undefined ? { is_active: body.is_active } : {}),
        ...(body.resetCoins ? { coins: 0 } : {}),
        ...(body.cancelDeletion ? { deletion_req: null } : {}),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (err: any) {
    console.error("Update user error:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
