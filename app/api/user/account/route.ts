import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

// DELETE /api/user/account — disabled direct delete (OTP required)
export async function DELETE() {
  return NextResponse.json(
    { error: "Direct delete disabled. Verify OTP via /api/user/account/verify-delete-otp." },
    { status: 400 }
  );
}

// GET /api/user/account — get user info (email)
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { email: true, telegramChatId: true, createdAt: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
