import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { assertUserCanUseApp, assertUserCanUseWriteActions } from "@/lib/user-access";

export async function GET() {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const access = await assertUserCanUseApp(session.userId);
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });

  let prefs = await db.userPreferences.findUnique({ where: { userId: session.userId } });

  // Auto-create defaults if not found
  if (!prefs) {
    prefs = await db.userPreferences.create({ data: { userId: session.userId } });
  }

  return NextResponse.json({
    keywords: prefs.keywords.split(",").map((k) => k.trim()).filter(Boolean),
    locations: prefs.locations.split(",").map((l) => l.trim()).filter(Boolean),
    experienceLevel: prefs.experienceLevel,
    jobType: prefs.jobType,
    instantAlerts: prefs.instantAlerts,
  });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const access = await assertUserCanUseWriteActions(session.userId);
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });

  const body = await req.json();
  const { keywords, locations, experienceLevel, jobType, instantAlerts } = body;
  const normalizedKeywords = Array.from(
    new Set(
      (Array.isArray(keywords) ? keywords : [])
        .map((k: string) => String(k).trim().toLowerCase())
        .filter(Boolean)
    )
  );
  const normalizedLocations = Array.from(
    new Set(
      (Array.isArray(locations) ? locations : [])
        .map((l: string) => String(l).trim().toLowerCase())
        .filter(Boolean)
    )
  );

  await db.userPreferences.upsert({
    where: { userId: session.userId },
    create: {
      userId: session.userId,
      keywords: normalizedKeywords.join(","),
      locations: normalizedLocations.join(","),
      experienceLevel: experienceLevel || "any",
      jobType: jobType || "any",
      instantAlerts: instantAlerts ?? true,
    },
    update: {
      keywords: normalizedKeywords.join(","),
      locations: normalizedLocations.join(","),
      experienceLevel: experienceLevel || "any",
      jobType: jobType || "any",
      instantAlerts: instantAlerts ?? true,
    },
  });

  return NextResponse.json({ success: true });
}
