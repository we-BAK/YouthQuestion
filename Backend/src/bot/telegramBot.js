const TelegramBot = require("node-telegram-bot-api");

const {
  saveTelegramQuestion,
} = require("../services/questionService");

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error("❌ TELEGRAM_BOT_TOKEN is missing");
}

console.log("🔄 Starting Telegram bot...");

const bot = new TelegramBot(token, {
  polling: true,
});

console.log("🤖 Telegram bot is running...");

// Detect Telegram polling problems
bot.on("polling_error", (error) => {
  console.error("❌ Telegram polling error:");
  console.error(error.message);
});

// Confirm that Telegram recognizes the bot
bot
  .getMe()
  .then((botInfo) => {
    console.log(
      `✅ Connected to Telegram as @${botInfo.username}`
    );
  })
  .catch((error) => {
    console.error("❌ Could not connect to Telegram:");
    console.error(error.message);
  });

// =========================
// /start
// =========================

bot.onText(/\/start/, async (msg) => {
  console.log("▶️ /start received");

  const chatId = msg.chat.id;

  const welcomeMessage = `
👋 እንኳን ደህና መጡ!

ይህ ቦት ስለ ሃይማኖት ያሉዎትን ጥያቄዎች
በነፃነት እንዲያካፍሉ የተዘጋጀ ነው።

🔐 ጥያቄዎ በሚስጥር ይያዛል။

✍️ ያለዎትን ጥያቄ እዚህ ይላኩ။
`;

  try {
    await bot.sendMessage(chatId, welcomeMessage);
    console.log("✅ Welcome message sent");
  } catch (error) {
    console.error(
      "❌ Failed to send welcome message:",
      error.message
    );
  }
});

// =========================
// Receive questions
// =========================

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const question = msg.text;

  console.log("\n📨 Telegram message received");
  console.log("Chat ID:", chatId);
  console.log("Text:", question);

  // Ignore commands
  if (!question || question.startsWith("/")) {
    console.log("⏭️ Ignoring command or empty message");
    return;
  }

  try {
    console.log("💾 Saving question to database...");

    const savedQuestion = await saveTelegramQuestion(
      msg,
      question.trim()
    );

    console.log(
      `✅ Question saved: ${savedQuestion.reference_number}`
    );

    const confirmationMessage = `
✅ ጥያቄዎ ተቀብለናል!

ጥያቄዎ ተመዝግቦ በሚቀጥለው
የወጣቶች መርሃ ግብር ውስጥ
ለውይይት ሊካተት ይችላል።

🙏 ጥያቄዎን ስላካፈሉን እናመሰግናለን።
`;

    await bot.sendMessage(
      chatId,
      confirmationMessage
    );

    console.log("📤 Confirmation sent to user");
  } catch (error) {
    console.error("❌ Failed to save question:");
    console.error(error);

    try {
      await bot.sendMessage(
        chatId,
        `
⚠️ ይቅርታ፣ ጥያቄዎን በመመዝገብ ላይ ችግር ተፈጥሯል።

እባክዎ እንደገና ይሞክሩ።
`
      );
    } catch (sendError) {
      console.error(
        "❌ Failed to send error message:",
        sendError.message
      );
    }
  }
});

module.exports = bot;