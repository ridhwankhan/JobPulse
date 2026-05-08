import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { assertUserCanUseApp } from "@/lib/user-access";

export async function GET() {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const access = await assertUserCanUseApp(session.userId);
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });

  const jobs = await db.jobListing.findMany({
    where: { trackedPage: { userId: session.userId } },
    include: { trackedPage: { select: { companyName: true, url: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ jobs });
}
