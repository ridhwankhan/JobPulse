import { NextResponse } from "next/server";
import { getCurrentUser, getAdminEmail } from "@/lib/admin";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ isAdmin: false });
  return NextResponse.json({
    isAdmin: user.email.toLowerCase() === getAdminEmail(),
    email: user.email,
  });
}
