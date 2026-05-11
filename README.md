# 🔍 KAIRO

> **An intelligent, real-time job monitoring platform that scrapes career pages and delivers instant Telegram alerts — so you never miss a job opening again.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-yellow?logo=python)](https://python.org/)
[![Telegram](https://img.shields.io/badge/Telegram-Bot%20API-blue?logo=telegram)](https://core.telegram.org/bots)

---

## 📖 What is KAIRO?

KAIRO is a full-stack job monitoring system built for job seekers who want to stay ahead. You add the career pages of companies you want to watch, and KAIRO automatically scrapes those pages in the background. The moment a new job link appears — matching roles like *Software Engineer*, *Data Analyst*, *MTO*, *Management Trainee*, or *Corporate Officer* — you instantly receive a notification directly in your personal Telegram account.

**No more manually refreshing career pages. No more missing deadlines. KAIRO watches for you.**

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     USER BROWSER                         │
│         Next.js Dashboard (localhost:3000)               │
│   Sign Up → Add URLs → Connect Telegram → Done!         │
└──────────────────┬──────────────────────────────────────┘
                   │ Prisma ORM
                   ▼
┌─────────────────────────────────────────────────────────┐
│              Supabase (PostgreSQL Cloud DB)              │
│   Tables: User, TrackedJobPage, JobListing              │
└──────────────────┬──────────────────────────────────────┘
                   │ psycopg2 (direct connection)
                   ▼
┌─────────────────────────────────────────────────────────┐
│              Python Scraper (scraper/main.py)           │
│   Reads URLs → Scrapes HTML → Deduplicates → Inserts    │
└──────────────────┬──────────────────────────────────────┘
                   │ Telegram Bot API
                   ▼
┌─────────────────────────────────────────────────────────┐
│                  Your Telegram Phone                     │
│           "🚨 NEW JOB FOUND — Apply Here →"            │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 16, React 19 | Dashboard UI, App Router |
| **Styling** | Tailwind CSS 4 | Utility-first styles |
| **UI Components** | shadcn/ui, Radix UI | Pre-built accessible components |
| **Animations** | Framer Motion | Smooth page transitions & effects |
| **Icons** | Lucide React | Consistent icon set |
| **Database** | Supabase (PostgreSQL) | Cloud-hosted relational database |
| **ORM** | Prisma 5 | Type-safe DB access for Next.js |
| **Auth** | Custom JWT (jose) | Signed session cookies |
| **Password Hashing** | bcryptjs | Secure credential storage |
| **Scraping** | Python + BeautifulSoup 4 | HTML parsing engine |
| **HTTP Client** | Python requests | Fetches career page HTML |
| **Next.js Scraping** | cheerio | Server-side HTML parsing in API |
| **Notifications** | Telegram Bot API | Instant push notifications |
| **Env Management** | python-dotenv | Secure credential loading |

---

## 📁 Project Structure

```
KAIRO/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── login/page.tsx            # Login page
│   ├── signup/page.tsx           # Sign up page
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signin/route.ts   # POST: authenticate user
│   │   │   └── signup/route.ts   # POST: register user
│   │   ├── scrape/route.ts       # POST: trigger scraping for logged-in user
│   │   └── user/
│   │       └── telegram/route.ts # GET/POST: user's Telegram Chat ID
│   └── dashboard/
│       ├── page.tsx              # Main dashboard overview
│       ├── layout.tsx            # Dashboard shell
│       ├── jobs/page.tsx         # Tracked job listings
│       ├── notifications/page.tsx# Notification history
│       ├── preferences/page.tsx  # User preferences
│       ├── telegram/page.tsx     # Telegram bot connection
│       └── urls/page.tsx         # URL tracker management
├── components/
│   ├── dashboard/
│   │   ├── header.tsx            # Dashboard top bar
│   │   ├── sidebar.tsx           # Navigation sidebar
│   │   ├── url-tracker.tsx       # URL management UI
│   │   ├── dashboard-client.tsx  # Client-side dashboard
│   │   ├── job-card.tsx          # Individual job display
│   │   ├── activity-feed.tsx     # Recent activity log
│   │   └── stats-card.tsx        # Summary stat cards
│   └── ui/                       # shadcn/ui component library (57 components)
├── lib/
│   ├── db.ts                     # Prisma client singleton
│   ├── session.ts                # JWT session helpers
│   ├── telegram.ts               # sendJobAlert() utility
│   └── utils.ts                  # General utilities
├── prisma/
│   └── schema.prisma             # Database schema (3 models)
├── scraper/
│   ├── main.py                   # Python scraping engine
│   └── requirements.txt          # Python dependencies
├── middleware.ts                  # Route protection (auth guard)
├── .env                          # Environment variables (git-ignored)
├── README.md                     # This file
└── instructions.md               # AI coding SOPs
```

---

## 🗄️ Database Schema

```prisma
model User {
  id             String           @id @default(cuid())
  email          String           @unique
  passwordHash   String
  telegramChatId String?          // User's personal Telegram ID
  trackedPages   TrackedJobPage[]
  createdAt      DateTime         @default(now())
}

model TrackedJobPage {
  id          String       @id @default(cuid())
  url         String       // e.g. https://careers.brac.net
  companyName String
  lastScraped DateTime?
  userId      String
  user        User         @relation(...)
  jobs        JobListing[]
  createdAt   DateTime     @default(now())
}

model JobListing {
  id            String         @id @default(cuid())
  title         String         // e.g. "Senior Data Analyst"
  url           String         @unique
  trackedPageId String
  trackedPage   TrackedJobPage @relation(...)
  createdAt     DateTime       @default(now())
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- A Supabase account (free tier works)
- A Telegram account

### 1. Clone & Install
```bash
git clone https://github.com/ridhwankhan/JobPulse.git
cd JobPulse
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Supabase / PostgreSQL
DATABASE_URL="postgresql://postgres:yourpassword@db.yourproject.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:yourpassword@db.yourproject.supabase.co:5432/postgres"

# Supabase Public Keys
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# JWT Auth
JWT_SECRET=your_random_secret_here
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000

# Telegram Bot
TELEGRAM_BOT_TOKEN="your_bot_token"

# Secure scheduled scraping (required for /api/cron/scrape)
CRON_SECRET="a_long_random_secret_value"

# Admin account email (required)
ADMIN_EMAIL="admin@example.com"

# SMTP for admin messaging (optional but recommended)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="KAIRO <your-email@gmail.com>"
```

> ⚠️ **Special Character Warning:** If your database password contains `#`, encode it as `%23` in the URL (e.g., `password123#` → `password123%23`).

### 3. Push Database Schema
```bash
npx prisma db push
```

### 4. Install Python Dependencies
```bash
cd scraper
pip install -r requirements.txt
cd ..
```

### 5. Run the Frontend
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 5.1 Optional: Trigger Scheduled Scrape Locally
```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/scrape
```
On Windows PowerShell:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/cron/scrape" -Headers @{ Authorization = "Bearer $env:CRON_SECRET" }
```

### 6. Run the Python Scraper
```bash
python scraper/main.py
```

---

## ⏱️ Auto Scrape (Daily on Free Plan)

KAIRO now includes a built-in cron endpoint: `GET /api/cron/scrape`.

- Add `CRON_SECRET` in your deployment environment variables.
- Keep `vercel.json` in the repo with:
  - `path`: `/api/cron/scrape`
  - `schedule`: `0 9 * * *`
- Vercel Hobby supports once-daily cron. This schedule runs once per day.
- The route scrapes **all users** who have tracked pages and sends Telegram alerts to each user's own chat ID.
- Admin account is prioritized first in scheduled scrape order.

### Manual Scrape Cooldown

- Normal users: manual scrape allowed once every **20 minutes**.
- Admin user: **no manual scrape cooldown**.

If you deploy on another platform, set any scheduler (cron/job runner) to call:

- URL: `https://<your-domain>/api/cron/scrape`
- Header: `Authorization: Bearer <CRON_SECRET>`

---

## 🔐 Account Recovery + Admin Features

- Signup now collects two user-defined recovery prompts + answers.
- Forgot password uses those saved recovery prompts:
  - `POST /api/auth/request-password-reset-otp`
  - `POST /api/auth/verify-password-reset-otp`
- Account deletion now requires:
  - current password
  - typing `DELETE` confirmation text
- Admin dashboard:
  - URL: `/dashboard/admin`
  - Access is restricted to `ADMIN_EMAIL`
  - Controls:
    - Toggle signup open/maintenance
    - View user details
    - Ban/restrict users
    - Force reset user password
    - Send email or direct Telegram message to users (if linked)

---

## 🔔 Setting Up Telegram Alerts

Each user connects their own personal Telegram for alerts:

1. Open Telegram → Search `@userinfobot` → Start chat → Copy your **numeric ID**
2. Open Telegram → Search your bot (e.g. `@Kairo_Job_bot`) → Click **Start**
3. Go to your KAIRO Dashboard → **Telegram** page
4. Click **Connect Telegram** → Paste your Chat ID → Click **Save & Connect**

✅ From now on, every new job found for your tracked URLs will ping YOUR Telegram instantly.

---

## 🔍 How the Scraper Works

The Python scraper (`scraper/main.py`) runs these steps:

1. **Fetch**: Reads all `TrackedJobPage` URLs and their owners' `telegramChatId` from Supabase.
2. **Scrape**: Downloads each page's HTML using `requests` with a real browser `User-Agent`.
3. **Parse**: Uses `BeautifulSoup` to extract all `<a>` tags.
4. **Filter**: Keeps only links that:
   - Contain job-role keywords (`engineer`, `manager`, `mto`, `data analyst`, etc.)
   - Are NOT generic navigation phrases (`learn more`, `seminar`, `login`, etc.)
   - Are NOT anchor (`#`) or JavaScript links
5. **Deduplicate**: Checks if the job URL already exists in `JobListing`.
6. **Alert**: If it's new → inserts into DB → sends Telegram message to the user.
7. **Cleanup**: Deletes job listings older than **10 days** to keep the database lean.

### Job Keywords Detected
`engineer`, `developer`, `manager`, `mto`, `management trainee`, `data analyst`, `data scientist`, `corporate`, `associate`, `specialist`, `director`, `officer`, `executive`, `lead`, `coordinator`

---

## 📡 API Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/signup` | Direct signup with recovery prompts + answers | ❌ |
| `POST` | `/api/auth/request-password-reset-otp` | Load saved recovery prompts for email | ❌ |
| `POST` | `/api/auth/verify-password-reset-otp` | Verify prompt answers and reset password | ❌ |
| `POST` | `/api/auth/signin` | Login, sets session cookie | ❌ |
| `DELETE` | `/api/user/account` | Delete account (requires password + `DELETE`) | ✅ |
| `POST` | `/api/scrape` | Scrape all user's URLs, send alerts | ✅ |
| `GET` | `/api/user/telegram` | Get current user's Telegram Chat ID | ✅ |
| `POST` | `/api/user/telegram` | Save user's Telegram Chat ID | ✅ |
| `GET` | `/api/admin/users` | List users for admin dashboard | ✅ Admin |
| `POST` | `/api/admin/users/status` | Ban/restrict user | ✅ Admin |
| `POST` | `/api/admin/users/force-reset-password` | Admin force reset user password | ✅ Admin |
| `POST` | `/api/admin/message` | Admin send email/Telegram to users | ✅ Admin |

---

## 🗺️ Roadmap — Upcoming Features

### 🔜 Version 1.1 — Stability & UX
- [ ] **Auto-Scrape Scheduler**: Windows Task Scheduler / cron job guide to auto-run Python scraper daily
- [ ] **Scrape from Dashboard**: "Scrape Now" button on the URL Tracker page calls `/api/scrape`
- [ ] **Real-time Job Feed**: Dashboard Jobs page shows live data from Supabase instead of mock data
- [ ] **Pagination**: Add pagination to job listings for users with many tracked URLs
- [ ] **Toast Notifications**: In-app browser toasts when a new scrape completes

### 🔜 Version 1.2 — Multi-User Polish
- [ ] **User-specific keyword filters**: Each user can set custom keywords beyond the defaults
- [ ] **Company logos**: Auto-fetch favicon/logo for each tracked company
- [ ] **Notification history**: Store and display the last 30 Telegram alerts per user
- [ ] **Email digest**: Daily email summary of new jobs found (optional alternative to Telegram)

### 🔜 Version 2.0 — Intelligence Layer
- [ ] **AI Job Matching**: Use a lightweight LLM to score job relevance against the user's profile/resume
- [ ] **Resume upload**: Users can upload a PDF resume; the AI uses it to filter which jobs are actually relevant
- [ ] **Duplicate title detection**: Fuzzy match job titles to prevent near-duplicate alerts
- [ ] **LinkedIn / Bdjobs integration**: Native API connectors for major job boards
- [ ] **Browser extension**: Chrome extension to add any page as a tracked URL in one click

### 🔜 Version 2.1 — Analytics
- [ ] **Job trend charts**: Track how many new jobs were found per company per week
- [ ] **Application tracker**: Mark jobs as Applied / Interviewing / Rejected
- [ ] **Best time to apply**: Analytics on when companies post new jobs (by day/hour)

### 🔜 Version 3.0 — SaaS & Deployment
- [ ] **Vercel deployment**: One-click deploy with environment variable guide
- [ ] **Subscription tiers**: Free (5 tracked URLs), Pro (unlimited + AI matching)
- [ ] **Team accounts**: Share a tracked URL list with a study group or team
- [ ] **Admin dashboard**: Monitor all users, scraping health, and system metrics

---

## 🔒 Security Notes

- Passwords are hashed with **bcrypt** (10 salt rounds) — never stored in plain text.
- Sessions use **signed JWT tokens** (HS256) stored in `httpOnly` cookies.
- All dashboard routes are protected by `middleware.ts` — unauthenticated requests are redirected.
- Recovery answers are hashed before storage and never exposed as plain text.
- Accounts can be banned/restricted from admin dashboard.
- Basic per-IP API rate limiting is enabled in middleware to reduce abuse/spam bursts.
- `.env` and other local secret files are git-ignored — never commit credentials.
- Supabase connection string is kept server-side only (not exposed to the browser).

### Sensitive Data Safety Checklist

Before pushing to GitHub:

1. Confirm `.env` is not tracked:
   - `git status --short .env`
2. Verify no hardcoded secrets in code:
   - `rg "postgresql://|TELEGRAM_BOT_TOKEN|SMTP_PASS|JWT_SECRET|sb_publishable_" .`
3. Use env variables for all runtime secrets:
   - DB, JWT, Telegram bot token, SMTP, admin email, cron secret.
   - 
---

## 📜 License

MIT License — feel free to fork, modify, and use this project.

---

*Built with ❤️ to help job seekers in Bangladesh and beyond never miss an opportunity.*
