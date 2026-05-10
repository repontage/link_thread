// workspace/link-thread-project/lib/telegram-logger.ts

export async function logToTelegram(message: string) {
  // 하드코딩 테스트 (Vercel 설정이 계속 실패할 경우 대비)
  const botToken = process.env.TELEGRAM_BOT_TOKEN || "8678409036:AAFMJNJW_quMn6EhMMQcit8mVex-pBm2zXk";
  const chatId = "8524015828"; 

  if (!botToken) {
    console.warn("TELEGRAM_BOT_TOKEN is not defined.");
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
