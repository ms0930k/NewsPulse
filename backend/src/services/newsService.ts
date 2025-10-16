import { fetchNewsCategory } from "../services/newsApiService";
import User from "../models/User";
import NewsSummary from "../models/NewsSummary";
import NewsScheduler from "../models/NewsScheduler";

export async function fetchAndScheduleNews(forUserId?: string) {
  console.log("🔄 Fetching and scheduling news...");

  try {
    // If userId passed → fetch for one user, else fetch for all subscribed users
    const users = forUserId
      ? await User.find({ _id: forUserId, subscription_status: true })
      : await User.find({ subscription_status: true });

    for (const user of users) {
      const [hour, minute] = (user.preferred_time_of_day || "09:00")
        .split(":")
        .map(Number);

      for (const cat of user.category) {
        const newsList = await fetchNewsCategory(cat);

        for (const news of newsList) {
          // Prevent duplicate summaries
          let summary = await NewsSummary.findOne({
            summary_text: news.summary_text,
          });
          if (!summary) {
            summary = await NewsSummary.create(news);
          }

          const existingSchedule = await NewsScheduler.findOne({
            user_id: user._id,
            summary_id: summary._id,
          });

          if (!existingSchedule) {
            const sendTime = new Date();
            sendTime.setHours(hour ?? 9, minute ?? 0, 0, 0);

            await NewsScheduler.create({
              user_id: user._id,
              summary_id: summary._id,
              send_time: sendTime,
              send_method:
                user.delivery_method === "both"
                  ? ["telegram", "email"]
                  : [user.delivery_method],
            });
          }
        }
      }
    }

    console.log("✅ News fetch + scheduling complete.");
  } catch (err) {
    console.error("❌ Error in fetchAndScheduleNews:", err);
  }
}
