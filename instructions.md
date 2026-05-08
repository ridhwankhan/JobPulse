# Developer & AI Instructions for Job Pulse

This document outlines the standard operating procedures and guidelines for developers and AI agents working on the **Job Pulse** project. **READ THIS FILE before making any code modifications or executing prompts.**

## 1. Golden Rules (Do Not Break)

1. **Verify Before Committing**: Never assume a UI component exists without checking `components.json` or the `components/` folder.
2. **Component Reusability**: Use existing `shadcn/ui` components from `@/components/ui/` whenever possible. Do not create duplicate custom components if a Radix UI or shadcn component already fits the need.
3. **Responsive Design**: All new features must be mobile-responsive by default using Tailwind's `sm:`, `md:`, `lg:` prefixes.
4. **Type Safety**: Avoid using `any` in TypeScript. Define robust interfaces and types for props, state, and API responses.
5. **No Broken Builds**: Before finalizing a session or a major feature, the project must successfully compile (`npm run build`).
6. **Dark Mode Compatibility**: Since we are using `next-themes` and Tailwind, test components in both dark and light modes. Use CSS variables defined in `globals.css` (e.g., `bg-background`, `text-foreground`, `bg-primary`).

## 2. Working Parallel (Multi-Developer Workflow)

Since there are two developers working separately:
- **Isolate Domains**: Both developers are working on the backend since the frontend is ready. Person 1 handles Database Setup, Auth, and connecting Dashboard UI to real API data. Person 2 handles the Web Scraping engine and Telegram Notifications.
- **Mocking**: If Person 1 needs scraping results that Person 2 hasn't built, or Person 2 needs a DB table Person 1 hasn't pushed yet, communicate the JSON structure and mock it temporarily.
- **File Ownership**: Avoid editing the exact same file simultaneously. Use dedicated directories (e.g., `app/api/` vs `app/(frontend)/`).

## 3. Post-Prompt Validation (Error Checking)

After the AI executes a prompt, always run a validation check to ensure the project hasn't broken.

### Recommended "Check Prompt" Ideas for the AI/User:
*After every major code change, paste one of these prompts to the AI to verify integrity:*

1. **The Build Check**: *"Run `npm run build` in the terminal to ensure there are no TypeScript or ESLint errors introduced by the last change. If there are errors, fix them before proceeding."*
2. **The Lint Check**: *"Run `npm run lint` and verify no new warnings or errors were created."*
3. **The UI Sanity Check**: *"Review the file you just edited and ensure all imported components exist in the directory structure. Did you import a Lucide icon that doesn't exist in our version?"*
4. **The Routing Check**: *"If you added a new page, verify the directory structure inside `/app` aligns with Next.js App Router conventions (e.g., folder name matches route, contains `page.tsx`)."*

## 4. Required Tech Stack Details
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Icons**: `lucide-react`
- **Animations**: `framer-motion`
- **State/Forms**: `react-hook-form` + `zod`

## 5. Typical Workflow for New Features
1. **Plan**: Define the feature and data required.
2. **Component**: Check if a UI component exists. If not, ask the AI to generate it using shadcn/ui.
3. **Implement**: Create the page/API route.
4. **Validate**: Use the prompt ideas from Section 3 to ensure the build isn't broken.
