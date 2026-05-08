import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { createOtp } from "@/lib/otp";
import { canSendEmail, sendOtpEmail } from "@/lib/email";
import { assertUserCanUseApp } from "@/lib/user-access";

export async function POST() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const access = await assertUserCanUseApp(session.userId);
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { code } = await createOtp({
      email: user.email,
      purpose: "delete-account",
      userId: user.id,
    });
    const smtpReady = canSendEmail();
    if (smtpReady) {
      await sendOtpEmail(user.email, code, "delete-account");
      return NextResponse.json({ success: true });
    }

    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({
        success: true,
        devOtp: code,
        warning: "SMTP is not configured. Using development OTP fallback.",
      });
    }

    return NextResponse.json(
      { error: "SMTP is not configured on the server. OTP email cannot be sent." },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Request delete OTP error:", error);
    return NextResponse.json({ error: error.message || "Failed to send OTP" }, { status: 500 });
  }
}
