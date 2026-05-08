import { NextResponse } from "next/server";
import { getAdminSettings, setSignupEnabled } from "@/lib/settings";
import { requireAdminUser } from "@/lib/admin";

export async function GET() {
  const admin = await requireAdminUser();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const settings = await getAdminSettings();
  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  const admin = await requireAdminUser();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { signupEnabled } = await req.json();
  await setSignupEnabled(Boolean(signupEnabled));
  return NextResponse.json({ success: true });
}
