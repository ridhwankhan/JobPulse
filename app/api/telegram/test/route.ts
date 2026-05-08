import { NextResponse } from "next/server";
import { sendJobAlert } from "@/lib/telegram";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

// POST /api/telegram/test — send a test alert to the user's Telegram
export async function POST() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { telegramChatId: true, email: true },
    });

    if (!user?.telegramChatId) {
      return NextResponse.json(
        { error: "No Telegram Chat ID connected. Go to Dashboard → Telegram to connect." },
        { status: 400 }
      );
    }

    await sendJobAlert(
      "Software Engineer (Test Alert)",
      "Job Pulse (Telegram Test)",
      `${process.env.NEXT_PUBLIC_APP_URL || "https://example.com"}/dashboard/jobs`,
      user.telegramChatId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TestAlert] Error:", error);
    return NextResponse.json({ error: "Failed to send test alert" }, { status: 500 });
  }
}
