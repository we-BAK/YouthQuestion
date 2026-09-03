require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, {
  polling: true,
});

console.log("🤖 Bot is running...");

// Welcome message
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const welcomeMessage = `
👋 እንኳን ደህና መጡ!

ይህ ቦት ስለ ሃይማኖት ያሉዎትን ጥያቄዎች
በነፃነት እንዲያካፍሉ የተዘጋጀ ነው።

🔐 ጥያቄዎ በሚስጥር ይያዛል።

✍️ ያለዎትን ጥያቄ እዚህ ይላኩ።
`;

  bot.sendMessage(chatId, welcomeMessage);
});

// Receive questions
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const question = msg.text;

  // Ignore commands such as /start
  if (!question || question.startsWith("/")) {
    return;
  }

  // Show question in terminal for now
  console.log("New question:");
  console.log(question);

  // Confirmation message
  const confirmationMessage = `
✅ ጥያቄዎ ተቀብለናል!

ጥያቄዎ ተመዝግቦ በሚቀጥለው
የወጣቶች መርሃ ግብር ውስጥ
ለውይይት ሊካተት ይችላል።

🙏 ጥያቄዎን ስላካፈሉን እናመሰግናለን።
`;

  bot.sendMessage(chatId, confirmationMessage);
});