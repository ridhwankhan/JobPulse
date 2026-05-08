import * as cheerio from "cheerio";
import { db } from "@/lib/db";
import { sendJobAlert } from "@/lib/telegram";
import { getAdminEmail } from "@/lib/admin";

export const DEFAULT_KEYWORDS = [
  "engineer",
  "developer",
  "manager",
  "mto",
  "associate",
  "management trainee",
  "data analyst",
  "data scientist",
  "corporate",
  "specialist",
  "director",
  "officer",
  "executive",
  "lead",
  "coordinator",
  "analyst",
  "consultant",
  "intern",
  "graduate",
  "trainee",
  "vacancy",
  "opening",
  "hiring",
  "recruiter",
  "accountant",
  "finance",
  "marketing",
];

const IGNORED_PHRASES = [
  "sign in",
  "login",
  "create account",
  "register",
  "privacy policy",
  "terms of service",
  "cookie",
  "about us",
  "contact us",
  "faq",
];

const EXPERIENCE_TERMS: Record<string, string[]> = {
  entry: ["entry", "junior", "fresher", "graduate", "intern", "trainee"],
  mid: ["mid", "experienced", "2 years", "3 years", "4 years"],
  senior: ["senior", "sr.", "5 years", "6 years", "7 years", "8 years"],
  lead: ["lead", "manager", "head of", "principal", "director"],
};

const JOB_TYPE_TERMS: Record<string, string[]> = {
  "full-time": ["full time", "full-time", "permanent"],
  "part-time": ["part time", "part-time"],
  contract: ["contract", "fixed term"],
  internship: ["internship", "intern"],
};

type PreferenceFilters = {
  keywords: string[];
  locations: string[];
  experienceLevel: string;
  jobType: string;
};

function parseCsv(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function buildPreferenceFilters(user: {
  preferences: {
    keywords: string;
    locations: string;
    experienceLevel: string;
    jobType: string;
    instantAlerts: boolean;
  } | null;
}): PreferenceFilters {
  const userKeywords = parseCsv(user.preferences?.keywords);
  const keywords = userKeywords.length > 0 ? userKeywords : DEFAULT_KEYWORDS;

  return {
    keywords,
    locations: parseCsv(user.preferences?.locations),
    experienceLevel: (user.preferences?.experienceLevel || "any").toLowerCase(),
    jobType: (user.preferences?.jobType || "any").toLowerCase(),
  };
}

function shouldMatchFilters(title: string, href: string, filters: PreferenceFilters): boolean {
  const text = `${title} ${href}`.toLowerCase();

  const keywordMatch = filters.keywords.some((kw) => text.includes(kw));
  if (!keywordMatch) return false;

  if (filters.locations.length > 0) {
    const locationMatch = filters.locations.some((loc) => text.includes(loc));
    if (!locationMatch) return false;
  }

  if (filters.experienceLevel !== "any") {
    const terms = EXPERIENCE_TERMS[filters.experienceLevel] || [];
    if (terms.length > 0 && !terms.some((term) => text.includes(term))) {
      return false;
    }
  }

  if (filters.jobType !== "any") {
    const terms = JOB_TYPE_TERMS[filters.jobType] || [];
    if (terms.length > 0 && !terms.some((term) => text.includes(term))) {
      return false;
    }
  }

  return true;
}

async function scrapePageForJobs(
  pageUrl: string,
  filters: PreferenceFilters
): Promise<{ title: string; url: string }[]> {
  const found: { title: string; url: string }[] = [];

  try {
    const response = await fetch(pageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      console.log(`[Scrape] ${pageUrl} returned ${response.status}`);
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    $("a[href]").each((_, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr("href") || "";
      const textLower = text.toLowerCase();

      if (text.length < 5 || text.length > 200) return;
      if (IGNORED_PHRASES.some((p) => textLower.includes(p))) return;
      if (href === "#" || href.startsWith("javascript:") || href === "") return;
      if (!shouldMatchFilters(text, href, filters)) return;

      try {
        const fullUrl = href.startsWith("http") ? href : new URL(href, pageUrl).href;
        const parsed = new URL(fullUrl);
        if (parsed.hash && !parsed.pathname.includes("job")) return;
        found.push({ title: text || "Job Opening", url: fullUrl });
      } catch {
        // Skip invalid URL
      }
    });
  } catch (err: any) {
    console.error(`[Scrape] Error fetching ${pageUrl}:`, err.message);
  }

  return found;
}

export async function runScrapeForUser(userId: string, singlePageId?: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      trackedPages: singlePageId ? { where: { id: singlePageId } } : true,
      preferences: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const filters = buildPreferenceFilters(user);
  let totalNew = 0;

  for (const page of user.trackedPages) {
    console.log(`[Scrape] Scanning: ${page.companyName} -> ${page.url}`);
    const foundJobs = await scrapePageForJobs(page.url, filters);
    console.log(`[Scrape] Found ${foundJobs.length} candidate links`);

    for (const job of foundJobs) {
      try {
        const exists = await db.jobListing.findUnique({
          where: { url_trackedPageId: { url: job.url, trackedPageId: page.id } },
        });

        if (!exists) {
          await db.jobListing.create({
            data: { title: job.title, url: job.url, trackedPageId: page.id },
          });
          totalNew++;

          if (user.preferences?.instantAlerts !== false) {
            await sendJobAlert(job.title, page.companyName, job.url, user.telegramChatId);
          }
        }
      } catch (err) {
        console.error("[Scrape] DB insert error:", err);
      }
    }

    await db.trackedJobPage.update({
      where: { id: page.id },
      data: { lastScraped: new Date() },
    });
  }

  const userPageIds = user.trackedPages.map((p) => p.id);
  if (userPageIds.length > 0) {
    await db.jobListing.deleteMany({
      where: {
        trackedPageId: { in: userPageIds },
        createdAt: { lt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      },
    });
  }

  return { userId: user.id, email: user.email, pagesScanned: user.trackedPages.length, newJobs: totalNew };
}

export async function runScrapeForAllUsers() {
  const users = await db.user.findMany({
    where: { trackedPages: { some: {} } },
    select: { id: true, email: true },
  });
  const adminEmail = getAdminEmail();
  users.sort((a, b) => {
    const aIsAdmin = a.email.toLowerCase() === adminEmail ? 1 : 0;
    const bIsAdmin = b.email.toLowerCase() === adminEmail ? 1 : 0;
    return bIsAdmin - aIsAdmin;
  });

  const results: Awaited<ReturnType<typeof runScrapeForUser>>[] = [];

  for (const user of users) {
    try {
      const result = await runScrapeForUser(user.id);
      results.push(result);
    } catch (error) {
      console.error(`[Scrape] Failed for user ${user.id}:`, error);
    }
  }

  return results;
}
