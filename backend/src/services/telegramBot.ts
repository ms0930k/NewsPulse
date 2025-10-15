import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN || "",{ polling: true });

// Handle incoming messages
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  console.log(`💬 Message from ${chatId}: ${msg.text}`);

  if (msg.text === "/start") {
    bot.sendMessage(
      chatId,
      "👋 Welcome to News93 Bot!\n\nWe’ll send you scheduled news updates here."
    );
  }
});
