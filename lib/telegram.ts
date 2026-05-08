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

  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: targetChatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const json = await res.json();
    if (!json.ok) {
      console.error("[Telegram] API error:", JSON.stringify(json));
    } else {
      console.log(`[Telegram] Alert sent to ${targetChatId} for: ${jobTitle}`);
    }
  } catch (error) {
    console.error("[Telegram] Fetch error:", error);
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
