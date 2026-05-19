// workspace/link-thread-project/lib/telegram-logger.ts

export async function logToTelegram(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken) {
    console.warn("TELEGRAM_BOT_TOKEN is not defined.");
    return;
  }

  if (!chatId) {
    console.warn("TELEGRAM_CHAT_ID is not defined.");
    return;
  }

  const payload = {
    chat_id: chatId,
    text: `🚀 [LinkThread Notification]\n\n${message}`,
    parse_mode: "Markdown",
  };

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      console.error("Telegram API Error:", await response.text());
    }
  } catch (error) {
    console.error("Error sending Telegram log:", error);
  }
}
