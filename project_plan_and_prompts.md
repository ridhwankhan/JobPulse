# KAIRO - Version 1 Execution Plan & Prompts

This document outlines the execution plan to build Version 1 of KAIRO, ensuring the website is functional and ready to be live on the internet. 

To maximize efficiency and avoid merge conflicts, the project is divided into two independent tracks for **Person 1 (Frontend/UI)** and **Person 2 (Backend/Scraping/Database)**.

## The Version 1 Goal
A functional web app where users can:
1. Sign up/Log in.
2. Paste a URL of a company's career page.
3. The system periodically scrapes that URL for new job postings.
4. If a new job is found, the system sends a Telegram notification to the user's phone.

---

## Post-Prompt Error Checking (For both Person 1 & 2)
To ensure the project does not break after executing prompts with AI, ALWAYS run one of the following validation prompts immediately after the AI writes code:

**Validation Prompt 1 (Syntax & Types):**
> "Run `npm run build` in the terminal to verify that there are no TypeScript, ESLint, or Next.js build errors introduced by your last change. If it fails, read the error log and fix it immediately without me having to ask."

**Validation Prompt 2 (UI Integrity):**
> "Check the UI component you just modified. Ensure that you haven't deleted any `framer-motion` animations, and that the Tailwind classes for responsiveness (`sm:`, `md:`) are still intact. Confirm you didn't invent any Shadcn components that don't exist in the `components.json`."

---

## Track A: Person 1 (Database, Auth, and Dashboard Integration)
**Goal:** Set up the database, handle user authentication, and connect the existing frontend UI to real database data.

### Prompt 1: Database Setup & Prisma Schema (Supabase PostgreSQL)
**Context:** Designing the database tables for users and their tracked pages.
**Prompt to AI:**
> "Set up Prisma for our Next.js project to connect to a Supabase PostgreSQL database. Create a `schema.prisma` file with three models: `User`, `TrackedJobPage` (contains url, companyName, lastScraped, userId), and `JobListing` (contains title, url, trackedPageId). Generate the schema and provide the command to push it to the database."


### Prompt 2: Authentication API & Logic
**Context:** Securing the application.
**Prompt to AI:**
> "Implement a simple authentication system for our Next.js App Router project. Create the necessary API routes for Sign In and Sign Up using the Supabase database. Then, protect the `/dashboard` route so that unauthenticated users are redirected to the login page."

### Prompt 3: Connecting the Dashboard to the Database
**Context:** Replacing frontend mock data with real data.
**Prompt to AI:**
> "In `app/dashboard/page.tsx`, we currently have a frontend structure. Update this page to be a Server Component that fetches the logged-in user's `TrackedJobPage` records from our Supabase database and passes them to a Client Component for rendering. Create the Server Action to handle the 'Add New Tracker' form submission so it saves to the database."

---

## Track B: Person 2 (Python Scraping Engine & Telegram Notifications)
**Goal:** Build a separate Python script/service that connects to the same SQLite database, parses HTML for jobs, checks for duplicates, and sends alerts to Telegram.

### Prompt 1: Python Scraper Setup & SQLite Connection
**Context:** Creating the Python environment and connecting to the DB.
**Prompt to AI:**
> "I want to create a Python script in a new folder called `scraper/`. Generate a `requirements.txt` with `requests`, `beautifulsoup4`, and `sqlite3`. Write a Python script `main.py` that connects to the `../prisma/dev.db` SQLite database (used by my Next.js app) and fetches all URLs from the `TrackedJobPage` table."

### Prompt 2: The Core Scraping Logic (BeautifulSoup)
**Context:** Extracting job listings from the fetched URLs.
**Prompt to AI:**
> "Update the Python `main.py` script. For every URL fetched from the database, use `requests` and `BeautifulSoup` to download the HTML. Find all `<a>` tags that contain text related to jobs (e.g., 'career', 'job', 'role'). For each link found, check if it already exists in the `JobListing` SQLite table. If it does not exist, insert it into the database as a new job."

### Prompt 3: Telegram Notification Integration (Python)
**Context:** Alerting the user when a new job is detected.
**Prompt to AI:**
> "I have a Telegram Bot. In my Python `scraper/` folder, I will store `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in a `.env` file (use `python-dotenv`). Create a function `send_telegram_alert(job_title, company, url)` that sends a POST request to the Telegram API. Integrate this into `main.py`: whenever a brand new job is inserted into the SQLite database, call this function to instantly send an alert to my phone."

