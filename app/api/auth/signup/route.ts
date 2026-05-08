import { NextResponse } from "next/server";
import { isSignupEnabled } from "@/lib/settings";

export async function POST(req: Request) {
  try {
    if (!(await isSignupEnabled())) {
      return NextResponse.json(
        { error: "Signup is temporarily disabled for maintenance. Please try again later." },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: "Direct signup disabled. Use OTP verification flow." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
