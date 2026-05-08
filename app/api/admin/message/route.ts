import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminUser } from "@/lib/admin";
import { sendEmail } from "@/lib/email";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: Request) {
  const admin = await requireAdminUser();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { targetEmail, subject, message, sendToAll, channel } = await req.json();
    const safeSubject = String(subject || "").trim();
    const safeMessage = String(message || "").trim();
    const safeTelegramMessage = safeMessage
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const safeChannel = channel === "telegram" ? "telegram" : "email";

    if (!safeSubject || !safeMessage) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    let recipients: Array<{ email: string; telegramChatId: string | null }> = [];
    if (sendToAll) {
      recipients = await db.user.findMany({
        select: { email: true, telegramChatId: true },
      });
    } else if (targetEmail) {
      const one = await db.user.findFirst({
        where: { email: { equals: String(targetEmail).trim().toLowerCase(), mode: "insensitive" } },
        select: { email: true, telegramChatId: true },
      });
      if (one) recipients = [one];
    }

    if (recipients.length === 0) {
      return NextResponse.json({ error: "No recipients found" }, { status: 400 });
    }

    let sent = 0;
    for (const recipient of recipients) {
      if (safeChannel === "telegram") {
        if (!recipient.telegramChatId) continue;
        await sendTelegramMessage(recipient.telegramChatId, safeTelegramMessage, "HTML");
        sent += 1;
      } else {
        await sendEmail(
          recipient.email,
          safeSubject,
          `<div style="font-family:Arial,sans-serif;line-height:1.6">${safeMessage.replace(/\n/g, "<br/>")}</div>`
        );
        sent += 1;
      }
    }

    return NextResponse.json({ success: true, sent });
  } catch (error: any) {
    console.error("Admin message error:", error);
    return NextResponse.json({ error: error.message || "Failed to send message" }, { status: 500 });
  }
}
