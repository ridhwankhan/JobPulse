/**
 * Sends a job alert to a specific user's Telegram chat ID.
 */
export async function sendJobAlert(
  jobTitle: string,
  company: string,
  url: string,
  chatId?: string | null
) {
  // Read env vars inside the function — NOT at module scope
  // This ensures they're always fresh, even after .env hot-reload
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const targetChatId = chatId?.trim();

  if (!botToken) {
    console.warn("[Telegram] TELEGRAM_BOT_TOKEN is not set in .env");
    return;
  }
  if (!targetChatId) {
    console.warn("[Telegram] Skipped alert: user has not connected Telegram chat ID.");
    return;
  }

  // Use HTML mode — more reliable than Markdown for links across all Telegram clients
  const safeTitle = escapeHtml(jobTitle || "Job Opening");
  const safeCompany = escapeHtml(company || "Unknown Company");
  const safeUrl = escapeHtml(url || "");
  const text = [
    `🚨 <b>NEW JOB FOUND</b> 🚨`,
    ``,
    `🏢 <b>Company:</b> ${safeCompany}`,
    `💼 <b>Role:</b> ${safeTitle}`,
    ``,
    safeUrl
      ? `🔗 <b>Apply Here:</b>\n<a href="${safeUrl}">${safeUrl}</a>`
      : `⚠️ <b>Apply Link:</b> not available`,
  ].join("\n");

  await sendTelegramMessage(targetChatId, text, "HTML");
  console.log(`[Telegram] Alert sent to ${targetChatId} for: ${jobTitle}`);
}

export async function sendTelegramMessage(
  chatId: string,
  text: string,
  parseMode: "HTML" | "MarkdownV2" = "HTML"
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    throw new Error("TELEGRAM_BOT_TOKEN is not set.");
  }
  if (!chatId?.trim()) {
    throw new Error("Telegram chat id is missing.");
  }

  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId.trim(),
      text,
      parse_mode: parseMode,
      disable_web_page_preview: true,
    }),
  });
  const json = await res.json();
  if (!json.ok) {
    throw new Error(json.description || "Telegram API error");
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
