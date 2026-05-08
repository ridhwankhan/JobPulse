import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { telegramChatId } = await req.json();

    if (typeof telegramChatId !== "string") {
      return NextResponse.json({ error: "Invalid Chat ID" }, { status: 400 });
    }

    const cleaned = telegramChatId.trim();

    await db.user.update({
      where: { id: session.userId },
      data: { telegramChatId: cleaned.length > 0 ? cleaned : null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update telegram error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { telegramChatId: true },
    });

    return NextResponse.json({ telegramChatId: user?.telegramChatId || null });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
