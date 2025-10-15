import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  imageUrl?: string;
}

export async function sendEmail(to: string, subject: string, newsItems: NewsItem[]) {
  // Build professional HTML email
  const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; padding: 20px;">
    <h2 style="color: #2c3e50;">📰 Your Daily News93 Digest</h2>
    <p>Hello <b>${to}</b>,</p>
    <p>Here’s your personalized news roundup for today:</p>

    ${newsItems
      .map(
        (item) => `
      <div style="border:1px solid #ddd; border-radius:8px; padding:16px; margin-bottom:20px; background:#fafafa;">
        ${
          item.imageUrl
            ? `<img src="${item.imageUrl}" alt="News Image" style="width:100%; max-height:200px; object-fit:cover; border-radius:6px; margin-bottom:10px;" />`
            : ""
        }
        <h3 style="margin:0 0 10px 0; color:#1a73e8;">${item.title}</h3>
        <p style="margin:0 0 12px 0; font-size:14px; color:#444;">${item.summary}</p>
        <a href="${item.url}" target="_blank" style="display:inline-block; padding:10px 16px; background:#1a73e8; color:#fff; text-decoration:none; border-radius:4px;">
          🔗 Read Full Article
        </a>
      </div>
    `
      )
      .join("")}

    <p style="margin-top: 30px;">Stay informed,<br><b>News93 Team</b></p>
  </div>
  `;

  try {
    await transporter.sendMail({
      from: `"News93" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Newsletter sent to ${to}`);
  } catch (err) {
    console.error("❌ Email sending error:", err);
  }
}
