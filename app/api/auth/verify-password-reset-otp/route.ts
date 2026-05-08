import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, answer1, answer2, newPassword } = await req.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const a1 = String(answer1 || "").trim().toLowerCase();
    const a2 = String(answer2 || "").trim().toLowerCase();
    const password = String(newPassword || "");

    if (!normalizedEmail || !a1 || !a2 || !password) {
      return NextResponse.json({ error: "Email, both answers, and new password are required." }, { status: 400 });
    }

    const user = await db.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: "insensitive" } },
    });
    if (!user) {
      return NextResponse.json({ error: "No account found for this email." }, { status: 404 });
    }
    if (!user.recoveryAnswerHash1 || !user.recoveryAnswerHash2) {
      return NextResponse.json(
        { error: "Recovery info is not configured for this account. Please contact admin." },
        { status: 400 }
      );
    }

    const match1 = await bcrypt.compare(a1, user.recoveryAnswerHash1);
    const match2 = await bcrypt.compare(a2, user.recoveryAnswerHash2);
    if (!match1 || !match2) {
      return NextResponse.json({ error: "Recovery answers do not match." }, { status: 400 });
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
