require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const { createClient } = require("@supabase/supabase-js");

// =========================
// Environment variables
// =========================

const token = process.env.TELEGRAM_BOT_TOKEN;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

// Check environment variables
if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN is missing from .env");
}

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is missing from .env");
}

if (!supabaseSecretKey) {
  throw new Error("SUPABASE_SECRET_KEY is missing from .env");
}

// =========================
// Supabase
// =========================

const supabase = createClient(
  supabaseUrl,
  supabaseSecretKey
);

// =========================
// Telegram Bot
// =========================

const bot = new TelegramBot(token, {
  polling: true,
});

console.log("🤖 Bot is running...");
console.log("🗄️ Supabase is connected.");

// =========================
// Helper: Generate question reference
// =========================

function generateQuestionReference() {
  const year = new Date().getFullYear();

  const randomNumber = Math.floor(
    100000 + Math.random() * 900000
  );

  return `Q-${year}-${randomNumber}`;
}

// =========================
// Helper: Get lookup ID
// =========================

async function getLookupId(table, code) {
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("code", code)
    .single();

  if (error) {
    throw new Error(
      `Could not find ${code} in ${table}: ${error.message}`
    );
  }

  return data.id;
}

// =========================
// Save Telegram User
// =========================

async function saveTelegramUser(msg) {
  const telegramUserId = String(msg.from.id);
  const telegramChatId = String(msg.chat.id);

  const { data, error } = await supabase
    .from("telegram_users")
    .upsert(
      {
        telegram_user_id: telegramUserId,
        telegram_chat_id: telegramChatId,
        last_seen_at: new Date().toISOString(),
        is_active: true,
      },
      {
        onConflict: "telegram_user_id",
      }
    )
    .select("id")
    .single();

  if (error) {
    throw new Error(
      `Could not save Telegram user: ${error.message}`
    );
  }

  return data.id;
}

// =========================
// Save Question
// =========================

async function saveQuestion(msg, question) {
  // Save/find Telegram user
  const telegramUserId = await saveTelegramUser(msg);

  // Get default question status
  const statusId = await getLookupId(
    "question_statuses",
    "NEW"
  );

  // Get question source
  const sourceId = await getLookupId(
    "question_sources",
    "TELEGRAM"
  );

  // Generate reference number
  const referenceNumber = generateQuestionReference();

  // Insert question
  const { data, error } = await supabase
    .from("questions")
    .insert({
      reference_number: referenceNumber,
      question_text: question,
      telegram_user_id: telegramUserId,
      status_id: statusId,
      source_id: sourceId,
      is_anonymous: true,
    })
    .select("id, reference_number")
    .single();

  if (error) {
    throw new Error(
      `Could not save question: ${error.message}`
    );
  }

  return data;
}

// =========================
// Welcome message
// =========================

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

// =========================
// Receive questions
// =========================

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const question = msg.text;

  // Ignore commands such as /start
  if (!question || question.startsWith("/")) {
    return;
  }

  try {
    console.log("\n📩 New question received:");
    console.log(question);

    // Save question to database
    const savedQuestion = await saveQuestion(
      msg,
      question
    );

    console.log("✅ Question saved successfully");
    console.log(
      `Reference: ${savedQuestion.reference_number}`
    );

    // Confirmation message
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

  } catch (error) {
    console.error("❌ Error saving question:");
    console.error(error);

    // Tell user something went wrong
    await bot.sendMessage(
      chatId,
      `
⚠️ ይቅርታ፣ ጥያቄዎን በመመዝገብ ላይ ችግር ተፈጥሯል።

እባክዎ እንደገና ይሞክሩ።
`
    );
  }
});