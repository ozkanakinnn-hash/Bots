const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");

initializeApp();

const BOT_TOKEN = "TELEGRAM_BOT_TOKENIN";
const CHAT_ID = "HEDEF_CHAT_ID";

exports.notifyBreakingNews = onDocumentCreated("articles/{articleId}", async (event) => {
  const data = event.data?.data();
  if (!data) return;

  const isSonDakika =
    data.category === "son-dakika" ||
    (Array.isArray(data.categories) && data.categories.includes("son-dakika"));

  if (!isSonDakika) return;

  const title = data.title || "Yeni Son Dakika Haberi";
  const url = data.url || data.link || "";
  const text = `🚨 *SON DAKİKA*\n\n*${title}*\n${url ? `\n🔗 ${url}` : ""}`;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: "Markdown",
    }),
  });
});
