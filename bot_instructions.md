# KAIRO - Phone Notification Bot Guide (Telegram)

Since KAIRO is designed to alert you the moment a new job is posted, the best way to get instant phone notifications is by creating a Telegram Bot. Telegram bots are free, have no rate limits for standard personal use, and provide instant push notifications to your phone.

Here are the step-by-step instructions for **Person 2 (Backend Developer)** to set up and integrate the Telegram notification bot.

## Step 1: Create the Bot on Telegram
1. Open the Telegram app on your phone or desktop.
2. Search for `@BotFather` (the official bot used to create other bots) and start a chat.
3. Send the command: `/newbot`
4. Provide a display name for your bot (e.g., `KAIRO Alerts`).
5. Provide a unique username for your bot (e.g., `Kairo_Job_bot`).
6. BotFather will reply with an **HTTP API Token** (e.g., `123456789:ABCdefGHIjklmnoPQRstuvWXYZ`).
   - **Keep this token secret!** 
   - Add it to your `.env.local` file in your project:
     ```env
     TELEGRAM_BOT_TOKEN="your_bot_token_here"
     ```

## Step 2: Get Your Personal Chat ID
To send a message directly to your phone, the bot needs to know your personal Telegram Chat ID.
1. In Telegram, search for `@userinfobot` or `@RawDataBot` and start a chat.
2. The bot will reply with your user information. Look for the `id` field (it will be a string of numbers like `987654321`).
3. Add this ID to your `.env.local` file:
   ```env
   TELEGRAM_CHAT_ID="your_chat_id_here"
   ```
*(Note: For a fully public version of KAIRO, you will eventually store each user's unique `chat_id` in your database. But for Version 1 and your own testing, environment variables are perfect).*

## Step 3: Integrating the Bot in Next.js (Backend Prompt)
Now, use the AI to write the code that sends the notification when a new job is found. 

**Give this prompt to the AI when you are ready to implement notifications:**

> "I have set up a Telegram bot. In my Next.js project, I have `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in my `.env` file. Create a utility function in `lib/telegram.ts` called `sendJobAlert(jobTitle: string, company: string, url: string)`. This function should make a fetch request to the Telegram Bot API (`https://api.telegram.org/bot[TOKEN]/sendMessage`) to send a formatted message to my chat ID. The message should say something like '🚨 **NEW JOB FOUND** 🚨\n\nCompany: [Company]\nRole: [jobTitle]\nApply here: [url]'. Ensure the text is parsed using Telegram's Markdown or HTML mode so it looks clean."

## Step 4: Trigger the Bot
Finally, call this function inside your web scraper route (`app/api/scrape/route.ts`). 
Whenever your scraper logic detects that a job does not exist in the database (meaning it is a brand new posting), you insert it into the database and immediately call `await sendJobAlert(...)`.

Your phone will now receive a push notification instantly!
