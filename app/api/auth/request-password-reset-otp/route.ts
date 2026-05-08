import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { canSendEmail, sendOtpEmail } from "@/lib/email";
import { createOtp } from "@/lib/otp";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await db.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: "insensitive" } },
    });
    if (!user) {
      return NextResponse.json({ error: "No account found for this email." }, { status: 404 });
    }

    const { code } = await createOtp({
      email: user.email,
      purpose: "forgot-password",
      userId: user.id,
    });

    if (canSendEmail()) {
      await sendOtpEmail(user.email, code, "forgot-password");
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
    console.error("Request password reset OTP error:", error);
    return NextResponse.json({ error: error.message || "Failed to send OTP" }, { status: 500 });
  }
}
