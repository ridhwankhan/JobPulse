import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clearSession, getSession } from "@/lib/session";
import { verifyOtp } from "@/lib/otp";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { otp } = await req.json();
    const code = String(otp || "").trim();
    if (!code) {
      return NextResponse.json({ error: "OTP is required" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const result = await verifyOtp({
      email: user.email,
      purpose: "delete-account",
      code,
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    await db.user.delete({ where: { id: user.id } });
    await clearSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify delete OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
