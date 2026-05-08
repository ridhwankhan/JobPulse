import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { runScrapeForUser } from "@/lib/scrape";
import { assertUserCanUseWriteActions } from "@/lib/user-access";

// POST /api/scrape — scrape all tracked pages for this user
// Optional body: { pageId: string } — scrape a single page only
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const access = await assertUserCanUseWriteActions(session.userId);
    if (!access.ok) {
      return NextResponse.json({ error: access.error }, { status: access.status });
    }

    const body = await req.json().catch(() => ({}));
    const singlePageId: string | undefined = body?.pageId;

    const result = await runScrapeForUser(session.userId, singlePageId);
    return NextResponse.json({ success: true, newJobs: result.newJobs, pagesScanned: result.pagesScanned });
  } catch (error) {
    console.error("[Scrape] Fatal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
