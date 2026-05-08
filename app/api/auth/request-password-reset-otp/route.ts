import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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

    return NextResponse.json({
      success: true,
      prompts: [
        user.recoveryPrompt1 || "Recovery prompt 1 is not set.",
        user.recoveryPrompt2 || "Recovery prompt 2 is not set.",
      ],
    });
  } catch (error: any) {
    console.error("Request password reset prompts error:", error);
    return NextResponse.json({ error: error.message || "Failed to load recovery prompts" }, { status: 500 });
  }
}
