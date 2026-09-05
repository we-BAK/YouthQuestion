const supabase = require("../config/supabase");

async function findOrCreateTelegramUser(msg) {
  const telegramUserId = msg.from.id;
  const telegramChatId = msg.chat.id;

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
      `Telegram user error: ${error.message}`
    );
  }

  return data.id;
}

module.exports = {
  findOrCreateTelegramUser,
};