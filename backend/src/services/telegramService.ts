import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_TOKEN || "";

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("⚠️ TELEGRAM_TOKEN is missing in environment");
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

export const sendTelegramMessage = async (chatId: string | number, text: string) => {
  try {
    await bot.sendMessage(chatId, text, { parse_mode: "MarkdownV2" });
    console.log(`✅ Message sent to Telegram user ${chatId}`);
  } catch (err: any) {
    const errorMessage = err?.message || String(err);
    console.error("❌ Telegram send error:", errorMessage);
    // Fallback: try sending without parse mode in case of formatting errors
    try {
      await bot.sendMessage(chatId, text);
      console.log(`✅ Message sent to Telegram user ${chatId} (fallback without parse mode)`);
    } catch (fallbackErr: any) {
      console.error("❌ Telegram fallback send error:", fallbackErr?.message || String(fallbackErr));
      throw fallbackErr;
    }
  }
};

export default bot;