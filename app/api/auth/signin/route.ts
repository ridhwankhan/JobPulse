import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

function mapAuthError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("P1001")) {
    return "Database connection failed. Check Vercel DATABASE_URL/DIRECT_URL and Supabase status.";
  }
  if (message.includes("P2021")) {
    return "Database schema is outdated. Run `npx prisma db push` against production database.";
  }

  return "Internal server error";
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await db.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    if (user.isBanned) {
      return NextResponse.json(
        { error: user.banReason || "Your account is banned. Contact admin." },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await createSession(user.id);

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, isRestricted: user.isRestricted },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json({ error: mapAuthError(error) }, { status: 500 });
  }
}
