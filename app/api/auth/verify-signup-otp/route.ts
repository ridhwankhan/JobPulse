import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { verifyOtp } from "@/lib/otp";
import { createSession } from "@/lib/session";
import { isSignupEnabled } from "@/lib/settings";

export async function POST(req: Request) {
  try {
    const { email, password, otp } = await req.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const plainPassword = String(password || "");
    const code = String(otp || "").trim();

    if (!normalizedEmail || !plainPassword || !code) {
      return NextResponse.json({ error: "Email, password and OTP are required" }, { status: 400 });
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

    const result = await verifyOtp({ email: normalizedEmail, purpose: "signup", code });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(plainPassword, 10);
    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        isEmailVerified: true,
      },
    });

    await createSession(user.id);
    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("Verify signup OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
