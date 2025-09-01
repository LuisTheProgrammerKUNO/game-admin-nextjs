import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        middle_name: true,
        school: true,
        birthday: true,
        location: true,
        is_active: true,
        deletion_req: true,
        coins: true,
        stripe_customer_id: true,

        // pull email from users_sync relation
        users_sync: {
          select: { email: true },
        },
      },
    });

    // flatten email so frontend can read `user.email`
    const formatted = users.map((u) => ({
      ...u,
      email: u.users_sync?.email ?? null,
    }));

    return NextResponse.json(formatted);
  } catch (err: any) {
    console.error("Error fetching users:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
