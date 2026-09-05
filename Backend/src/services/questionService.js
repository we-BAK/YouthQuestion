const supabase = require("../config/supabase");
const {
  findOrCreateTelegramUser,
} = require("./telegramUserService");

async function getLookupId(table, code) {
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("code", code)
    .single();

  if (error) {
    throw new Error(
      `Lookup error (${table}/${code}): ${error.message}`
    );
  }

  return data.id;
}

function generateQuestionReference() {
  const year = new Date().getFullYear();

  const number = Math.floor(
    100000 + Math.random() * 900000
  );

  return `Q-${year}-${number}`;
}

async function saveTelegramQuestion(msg, question) {
  const telegramUserId =
    await findOrCreateTelegramUser(msg);

  const statusId = await getLookupId(
    "question_statuses",
    "NEW"
  );

  const sourceId = await getLookupId(
    "question_sources",
    "TELEGRAM"
  );

  const referenceNumber =
    generateQuestionReference();

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
    .select(
      "id, reference_number, question_text"
    )
    .single();

  if (error) {
    throw new Error(
      `Question insert failed: ${error.message}`
    );
  }

  return data;
}

module.exports = {
  saveTelegramQuestion,
};