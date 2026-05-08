import os
import uuid
import requests
import psycopg2
import html
from psycopg2.extras import DictCursor
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from dotenv import load_dotenv

# Load from root project .env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

DATABASE_URL = os.getenv("DATABASE_URL")

# ── Keywords that suggest an actual job posting ──────────────────────────────
JOB_KEYWORDS = [
    'engineer', 'developer', 'manager', 'mto', 'associate',
    'management trainee', 'data analyst', 'data scientist', 'corporate',
    'specialist', 'director', 'officer', 'executive', 'lead', 'coordinator',
    'analyst', 'consultant', 'intern', 'graduate', 'trainee', 'vacancy',
    'opening', 'hiring', 'recruiter', 'accountant', 'finance', 'marketing'
]

EXPERIENCE_TERMS = {
    'entry': ['entry', 'junior', 'fresher', 'graduate', 'intern', 'trainee'],
    'mid': ['mid', 'experienced', '2 years', '3 years', '4 years'],
    'senior': ['senior', 'sr.', '5 years', '6 years', '7 years', '8 years'],
    'lead': ['lead', 'manager', 'head of', 'principal', 'director'],
}

JOB_TYPE_TERMS = {
    'full-time': ['full time', 'full-time', 'permanent'],
    'part-time': ['part time', 'part-time'],
    'contract': ['contract', 'fixed term'],
    'internship': ['internship', 'intern'],
}

# ── Generic/navigation phrases to ignore ─────────────────────────────────────
IGNORED_PHRASES = [
    'sign in', 'login', 'create account', 'register', 'privacy policy',
    'terms of service', 'cookie', 'about us', 'contact us', 'faq'
]


def get_db_connection():
    if not DATABASE_URL:
        print("DATABASE_URL is missing in .env")
        return None
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"PostgreSQL connection error: {e}")
        return None


def fetch_tracked_urls():
    """Fetch all tracked URLs + user telegramChatId + user keywords from the database."""
    conn = get_db_connection()
    if not conn:
        return []
    try:
        cursor = conn.cursor(cursor_factory=DictCursor)
        cursor.execute('''
            SELECT tp.id, tp.url, tp."companyName", tp."userId", u."telegramChatId",
                   COALESCE(up.keywords, '') as "userKeywords",
                   COALESCE(up.locations, '') as "locations",
                   COALESCE(up."experienceLevel", 'any') as "experienceLevel",
                   COALESCE(up."jobType", 'any') as "jobType",
                   COALESCE(up."instantAlerts", true) as "instantAlerts"
            FROM "TrackedJobPage" tp
            JOIN "User" u ON u.id = tp."userId"
            LEFT JOIN "UserPreferences" up ON up."userId" = u.id
        ''')
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    except Exception as e:
        print(f"Postgres error fetching URLs: {e}")
        return []
    finally:
        conn.close()


def scrape_jobs_from_url(url, keywords):
    """Scrape the given URL for job links, filtering noise."""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    found_jobs = []
    try:
        response = requests.get(url, headers=headers, timeout=15, verify=False)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        for a_tag in soup.find_all('a', href=True):
            text = a_tag.get_text(strip=True)
            text_lower = text.lower()
            href = a_tag['href']
            href_lower = href.lower()

            # Skip very short or very long text
            if len(text) < 5 or len(text) > 200:
                continue

            # Skip noise phrases
            if any(p in text_lower for p in IGNORED_PHRASES):
                continue

            # Skip anchor-only and javascript links
            if href == '#' or href.startswith('javascript:') or href == '':
                continue

            # Check keyword match in link text OR href
            if (
                any(kw in text_lower for kw in keywords) or
                any(kw in href_lower for kw in keywords)
            ):
                full_url = urljoin(url, href)
                found_jobs.append({'title': text, 'url': full_url})

    except Exception as e:
        print(f"Error scraping {url}: {e}")

    return found_jobs


def send_telegram_alert(job_title, company, url, chat_id=None):
    """Send a notification to a user's Telegram using HTML mode."""
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    target = (chat_id or "").strip()

    if not token or not target:
        print(f"Telegram: no token or chat_id (token={'set' if token else 'missing'}, chat_id={target})")
        return

    safe_company = html.escape(company or "Unknown Company")
    safe_title = html.escape(job_title or "Job Opening")
    safe_url = html.escape(url or "")
    text = (
        "🚨 <b>NEW JOB FOUND</b> 🚨\n\n"
        f"🏢 <b>Company:</b> {safe_company}\n"
        f"💼 <b>Role:</b> {safe_title}\n\n"
        + (f"🔗 <b>Apply Here:</b>\n<a href=\"{safe_url}\">{safe_url}</a>" if safe_url else "⚠️ <b>Apply Link:</b> not available")
    )
    api_url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": target,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }
    try:
        r = requests.post(api_url, json=payload, timeout=10)
        if r.status_code == 200:
            print(f"  TG alert sent to {target}")
        else:
            print(f"  TG error: {r.text}")
    except Exception as e:
        print(f"  TG send failed: {e}")


def save_new_jobs(tracked_page_id, company_name, jobs, telegram_chat_id=None, instant_alerts=True):
    """Save new jobs to the JobListing table, per-page deduplication."""
    conn = get_db_connection()
    if not conn:
        return 0

    new_jobs_count = 0
    try:
        cursor = conn.cursor()
        for job in jobs:
            # Per-page deduplication (compound unique: url + trackedPageId)
            cursor.execute(
                'SELECT id FROM "JobListing" WHERE url = %s AND "trackedPageId" = %s',
                (job['url'], tracked_page_id)
            )
            if cursor.fetchone():
                continue

            job_id = str(uuid.uuid4())
            cursor.execute(
                'INSERT INTO "JobListing" (id, title, url, "trackedPageId") VALUES (%s, %s, %s, %s)',
                (job_id, job['title'], job['url'], tracked_page_id)
            )
            new_jobs_count += 1
            print(f"  NEW: {job['title']}")

            if instant_alerts:
                send_telegram_alert(job['title'], company_name, job['url'], telegram_chat_id)

        conn.commit()

        # Update lastScraped
        cursor.execute(
            'UPDATE "TrackedJobPage" SET "lastScraped" = NOW() WHERE id = %s',
            (tracked_page_id,)
        )
        conn.commit()

    except Exception as e:
        print(f"Postgres error: {e}")
    finally:
        conn.close()

    return new_jobs_count


def cleanup_old_jobs():
    """Delete job listings older than 10 days to keep the database light."""
    conn = get_db_connection()
    if not conn:
        return
    try:
        cursor = conn.cursor()
        cursor.execute(
            "DELETE FROM \"JobListing\" WHERE \"createdAt\" < NOW() - INTERVAL '10 days'"
        )
        deleted = cursor.rowcount
        conn.commit()
        if deleted > 0:
            print(f"Cleaned up {deleted} old job(s).")
    except Exception as e:
        print(f"Cleanup error: {e}")
    finally:
        conn.close()


if __name__ == "__main__":
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

    print("--- Job Pulse Scraper ---")
    pages = fetch_tracked_urls()

    if not pages:
        print("No tracked pages found. Add URLs via the dashboard first.")

    for page in pages:
        # Merge user keywords with defaults
        user_kw = [k.strip().lower() for k in page.get('userKeywords', '').split(',') if k.strip()]
        all_keywords = user_kw if user_kw else JOB_KEYWORDS[:]

        locations = [k.strip().lower() for k in page.get('locations', '').split(',') if k.strip()]
        experience_level = (page.get('experienceLevel') or 'any').strip().lower()
        job_type = (page.get('jobType') or 'any').strip().lower()
        if locations:
            all_keywords.extend(locations)
        if experience_level != 'any':
            all_keywords.extend(EXPERIENCE_TERMS.get(experience_level, []))
        if job_type != 'any':
            all_keywords.extend(JOB_TYPE_TERMS.get(job_type, []))
        all_keywords = list(set(all_keywords))

        print(f"\nScraping: {page['companyName']} ({page['url']})")
        jobs = scrape_jobs_from_url(page['url'], all_keywords)
        print(f"  Found {len(jobs)} candidate links")

        new_count = save_new_jobs(
            page['id'],
            page['companyName'],
            jobs,
            telegram_chat_id=page.get('telegramChatId'),
            instant_alerts=page.get('instantAlerts', True)
        )
        if new_count == 0:
            print("  No new jobs.")
        else:
            print(f"  Saved {new_count} new job(s)!")

    cleanup_old_jobs()
    print("\n--- Done ---")
