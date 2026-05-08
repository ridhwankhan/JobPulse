import { NextResponse } from "next/server";
import { runScrapeForAllUsers } from "@/lib/scrape";

function isAuthorized(req: Request): boolean {
  const bearer = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
  return bearer === `Bearer ${cronSecret}`;
}

async function handleCron(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await runScrapeForAllUsers();
  const totalUsers = results.length;
  const totalNewJobs = results.reduce((sum, r) => sum + r.newJobs, 0);
  const totalPages = results.reduce((sum, r) => sum + r.pagesScanned, 0);

  return NextResponse.json({
    success: true,
    summary: { totalUsers, totalPages, totalNewJobs },
    users: results,
  });
}

export async function GET(req: Request) {
  try {
    return await handleCron(req);
  } catch (error) {
    console.error("[CronScrape] Fatal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    return await handleCron(req);
  } catch (error) {
    console.error("[CronScrape] Fatal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
