import { NextResponse } from "next/server";
import { isSignupEnabled } from "@/lib/settings";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { email, password, recoveryPrompt1, recoveryPrompt2, recoveryAnswer1, recoveryAnswer2 } = await req.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (
      !normalizedEmail ||
      !password ||
      !recoveryPrompt1 ||
      !recoveryPrompt2 ||
      !recoveryAnswer1 ||
      !recoveryAnswer2
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

    const passwordHash = await bcrypt.hash(String(password), 10);
    const answerHash1 = await bcrypt.hash(String(recoveryAnswer1).trim().toLowerCase(), 10);
    const answerHash2 = await bcrypt.hash(String(recoveryAnswer2).trim().toLowerCase(), 10);

    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        isEmailVerified: true,
        recoveryPrompt1: String(recoveryPrompt1).trim(),
        recoveryPrompt2: String(recoveryPrompt2).trim(),
        recoveryAnswerHash1: answerHash1,
        recoveryAnswerHash2: answerHash2,
      },
    });

    await createSession(user.id);
    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
