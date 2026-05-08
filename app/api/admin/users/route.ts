import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminUser } from "@/lib/admin";

export async function GET() {
  const admin = await requireAdminUser();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      trackedPages: { select: { id: true } },
      _count: { select: { trackedPages: true } },
    },
  });

  const data = await Promise.all(
    users.map(async (u) => {
      const jobCount = await db.jobListing.count({
        where: { trackedPage: { userId: u.id } },
      });
      return {
        id: u.id,
        email: u.email,
        isEmailVerified: u.isEmailVerified,
        isBanned: u.isBanned,
        isRestricted: u.isRestricted,
        banReason: u.banReason,
        telegramChatId: u.telegramChatId,
        telegramConnected: Boolean(u.telegramChatId),
        trackedPages: u._count.trackedPages,
        jobs: jobCount,
        createdAt: u.createdAt,
      };
    })
  );

  return NextResponse.json({ users: data });
}
