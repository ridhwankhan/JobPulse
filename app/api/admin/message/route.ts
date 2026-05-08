import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminUser } from "@/lib/admin";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  const admin = await requireAdminUser();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { targetEmail, subject, message, sendToAll } = await req.json();
    const safeSubject = String(subject || "").trim();
    const safeMessage = String(message || "").trim();

    if (!safeSubject || !safeMessage) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    let recipients: string[] = [];
    if (sendToAll) {
      const users = await db.user.findMany({ select: { email: true } });
      recipients = users.map((u) => u.email);
    } else if (targetEmail) {
      recipients = [String(targetEmail).trim().toLowerCase()];
    }

    if (recipients.length === 0) {
      return NextResponse.json({ error: "No recipients found" }, { status: 400 });
    }

    for (const recipient of recipients) {
      await sendEmail(
        recipient,
        safeSubject,
        `<div style="font-family:Arial,sans-serif;line-height:1.6">${safeMessage.replace(/\n/g, "<br/>")}</div>`
      );
    }

    return NextResponse.json({ success: true, sent: recipients.length });
  } catch (error: any) {
    console.error("Admin message error:", error);
    return NextResponse.json({ error: error.message || "Failed to send message" }, { status: 500 });
  }
}
