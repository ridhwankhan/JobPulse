import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminUser } from "@/lib/admin";

export async function POST(req: Request) {
  const admin = await requireAdminUser();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, isBanned, isRestricted, banReason } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });
  if (String(userId) === admin.id) {
    return NextResponse.json({ error: "Admin cannot ban/restrict self." }, { status: 400 });
  }

  await db.user.update({
    where: { id: String(userId) },
    data: {
      isBanned: Boolean(isBanned),
      isRestricted: Boolean(isRestricted),
      banReason: String(banReason || "").trim() || null,
    },
  });

  return NextResponse.json({ success: true });
}
