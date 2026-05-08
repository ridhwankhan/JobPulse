import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { runScrapeForUser } from "@/lib/scrape";
import { assertUserCanUseWriteActions } from "@/lib/user-access";
import { db } from "@/lib/db";
import { getAdminEmail } from "@/lib/admin";

const MANUAL_SCRAPE_COOLDOWN_MS = 20 * 60 * 1000;
const manualScrapeKey = (userId: string) => `manual_scrape_last_${userId}`;

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
    const isAdmin = access.user.email.toLowerCase() === getAdminEmail();

    if (!isAdmin) {
      const key = manualScrapeKey(session.userId);
      const setting = await db.appSetting.findUnique({ where: { key } });
      const lastMs = setting ? Number(setting.value) : 0;
      const now = Date.now();
      const remainingMs = lastMs + MANUAL_SCRAPE_COOLDOWN_MS - now;

      if (remainingMs > 0) {
        const remainingMinutes = Math.ceil(remainingMs / 60000);
        return NextResponse.json(
          { error: `Manual scrape cooldown active. Try again in ${remainingMinutes} minute(s).` },
          { status: 429 }
        );
      }
    }

    const body = await req.json().catch(() => ({}));
    const singlePageId: string | undefined = body?.pageId;

    const result = await runScrapeForUser(session.userId, singlePageId);
    if (!isAdmin) {
      await db.appSetting.upsert({
        where: { key: manualScrapeKey(session.userId) },
        create: { key: manualScrapeKey(session.userId), value: String(Date.now()) },
        update: { value: String(Date.now()) },
      });
    }
    return NextResponse.json({ success: true, newJobs: result.newJobs, pagesScanned: result.pagesScanned });
  } catch (error) {
    console.error("[Scrape] Fatal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
