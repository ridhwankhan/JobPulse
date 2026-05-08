import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clearSession, getSession } from "@/lib/session";
import bcrypt from "bcryptjs";

// DELETE /api/user/account — delete account with current password + confirmation text
export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, confirmText } = await req.json().catch(() => ({}));
    if (!currentPassword || !confirmText) {
      return NextResponse.json({ error: "Current password and confirmation text are required." }, { status: 400 });
    }
    if (String(confirmText).trim().toUpperCase() !== "DELETE") {
      return NextResponse.json({ error: "Please type DELETE to confirm." }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { id: true, passwordHash: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const valid = await bcrypt.compare(String(currentPassword), user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    await db.user.delete({ where: { id: user.id } });
    await clearSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
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
