import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";
import { isSignupEnabled } from "@/lib/settings";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!(await isSignupEnabled())) {
      return NextResponse.json(
        { error: "Signup is temporarily disabled for maintenance. Please try again later." },
        { status: 403 }
      );
    }

    const existingUser = await db.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: "insensitive" } },
    });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const { code } = await createOtp({ email: normalizedEmail, purpose: "signup" });
    await sendOtpEmail(normalizedEmail, code, "signup");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Request signup OTP error:", error);
    return NextResponse.json({ error: error.message || "Failed to send OTP" }, { status: 500 });
  }
}
