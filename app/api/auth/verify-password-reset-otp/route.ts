import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { verifyOtp } from "@/lib/otp";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const code = String(otp || "").trim();
    const password = String(newPassword || "");

    if (!normalizedEmail || !code || !password) {
      return NextResponse.json({ error: "Email, OTP and new password are required." }, { status: 400 });
    }

    const user = await db.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: "insensitive" } },
    });
    if (!user) {
      return NextResponse.json({ error: "No account found for this email." }, { status: 404 });
    }

    const result = await verifyOtp({
      email: user.email,
      purpose: "forgot-password",
      code,
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify password reset OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
