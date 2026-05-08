# Job Pulse

Job Pulse is an AI-powered job monitoring platform that helps users never miss a job opportunity. It allows users to track any company's career page and provides real-time detection of new job postings, sending instant alerts directly to Telegram.

## Features

- **Track Any Career Page**: Add URLs from any company's career page, and we'll monitor them 24/7 for new job postings.
- **Real-time Detection**: Our scraper engine detects new jobs within minutes of posting, not hours or days.
- **Telegram Alerts**: Get instant notifications directly in Telegram with job details and apply links.
- **Smart Deduplication**: Never see the same job twice. Our system ensures you only get fresh, unique listings.

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, Framer Motion
- **UI Components**: shadcn/ui (Radix UI), Lucide React
- **Forms & Validation**: React Hook Form, Zod
- **Styling**: PostCSS, Tailwind Merge, clsx

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app`: Contains the Next.js app router pages, layouts, and global styles.
- `/components`: Reusable UI components, primarily built with shadcn/ui.
- `/lib`: Utility functions and shared logic.
- `/hooks`: Custom React hooks.
- `/public`: Static assets like images and icons.
