import { Request,Response } from "express";
import { sendTelegramMessage } from "../services/telegramService";
import { escapeTelegramMarkdown } from "./telegramHelper";
import User from "../models/User";
import NewsSummary from "../models/NewsSummary";

export const sendTestMessage = async (req: Request, res: Response) => {
    try{
        const { userId, summaryId } = req.body;

        if(!userId || !summaryId){
            return res.status(400).json({
                error: "userId and summaryId are required"
            });
        }

        const user = await User.findById(userId);
        const summary = await NewsSummary.findById(summaryId);

        if (!user) return res.status(404).json({ error: "User not found" });
        if (!summary) return res.status(404).json({ error: "Summary not found" });
        if (!user.telegram_id) return res.status(400).json({ error: "User has no Telegram ID" });

        // Build message for MarkdownV2, escape dynamic content and include raw URL
        const message = `📰 ${escapeTelegramMarkdown(`*${summary.category || "News"}*`)}\n\n${escapeTelegramMarkdown(summary.summary_text)}\n\n🔗 ${summary.source_url}`;

        await sendTelegramMessage(user.telegram_id, message);

        res.json({
            success: true,
            sentTo: user.username || user.email,
            chatId: user.telegram_id,
            summary: summary.summary_text,
        });
    }
    catch(err: any){
        console.error("❌ Error sending test message:", err.message);
        res.status(500).json({ error: "Failed to send message", details: err.message });
    }
}