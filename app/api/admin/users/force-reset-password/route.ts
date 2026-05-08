import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requireAdminUser } from "@/lib/admin";
import { canSendEmail, sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  const admin = await requireAdminUser();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, newPassword } = await req.json();
  if (!userId || !newPassword) {
    return NextResponse.json({ error: "userId and newPassword are required" }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { id: String(userId) },
    select: { email: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const passwordHash = await bcrypt.hash(String(newPassword), 10);
  await db.user.update({
    where: { id: String(userId) },
    data: { passwordHash },
  });

  let emailed = false;
  if (canSendEmail()) {
    await sendEmail(
      user.email,
      "Your JobPulse password was reset by admin",
      `<div style="font-family:Arial,sans-serif;line-height:1.6">
        <p>Your account password was reset by an administrator.</p>
        <p><strong>Temporary password:</strong> ${String(newPassword)}</p>
        <p>Please sign in and change your password immediately.</p>
      </div>`
    );
    emailed = true;
  }

  return NextResponse.json({ success: true, emailed });
}
