const supabase = require("../config/supabase");
const { findOrCreateTelegramUser } = require("./telegramUserService");

async function getLookupId(table, code) {
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("code", code)
    .single();

  if (error) {
    throw new Error(`Lookup error (${table}/${code}): ${error.message}`);
  }

  return data.id;
}

function generateQuestionReference() {
  const year = new Date().getFullYear();
  const number = Math.floor(100000 + Math.random() * 900000);
  return `Q-${year}-${number}`;
}

async function saveTelegramQuestion(msg, question) {
  const telegramUserId = await findOrCreateTelegramUser(msg);
  const statusId = await getLookupId("question_statuses", "NEW");
  const sourceId = await getLookupId("question_sources", "TELEGRAM");
  const referenceNumber = generateQuestionReference();

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
    .select("id, reference_number, question_text")
    .single();

  if (error) {
    throw new Error(`Question insert failed: ${error.message}`);
  }

  return data;
}

async function assignCategoryToQuestion(questionId, categoryId, adminUserId) {
  const payload = {
    question_id: questionId,
    category_id: categoryId,
  };

  if (adminUserId) {
    payload.assigned_by = adminUserId;
  }

  const { data, error } = await supabase
    .from("question_categories")
    .upsert(payload, { onConflict: "question_id, category_id" })
    .select();

  if (error) {
    console.error("❌ Failed to assign category:", error);
    throw new Error(`Failed to assign category: ${error.message}`);
  }

  return data;
}

// Remove a category assignment from a question
async function removeCategoryFromQuestion(questionId, categoryId) {
  const { error } = await supabase
    .from("question_categories")
    .delete()
    .eq("question_id", questionId)
    .eq("category_id", categoryId);

  if (error) {
    throw new Error(`Failed to remove category: ${error.message}`);
  }

  return true;
}

// Fetch all collected questions along with status, source, categories, and assigned_by user details
async function getAllQuestions() {
  const { data: rawQuestions, error } = await supabase
    .from("questions")
    .select(`
      id,
      reference_number,
      question_text,
      is_anonymous,
      created_at,
      question_statuses ( id, code, name ),
      question_sources ( id, code, name ),
      question_categories (
        category_id,
        assigned_by,
        categories ( id, name )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch questions: ${error.message}`);
  }

  // Collect unique user IDs from assigned_by
  const userIds = [
    ...new Set(
      rawQuestions
        .flatMap((q) => q.question_categories || [])
        .map((qc) => qc.assigned_by)
        .filter(Boolean)
    ),
  ];

  // Fetch profiles for the collected user IDs
  const userMap = {};
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("user_profiles")
      .select("id, full_name, email")
      .in("id", userIds);

    if (profiles) {
      profiles.forEach((p) => {
        userMap[p.id] = p.full_name || p.email;
      });
    }
  }

  // Normalize data for frontend consumption
  return rawQuestions.map((q) => ({
    id: q.id,
    referenceNumber: q.reference_number,
    questionText: q.question_text,
    isAnonymous: q.is_anonymous,
    createdAt: q.created_at,
    status: q.question_statuses?.name || q.question_statuses?.code || "NEW",
    source: q.question_sources?.name || q.question_sources?.code || "TELEGRAM",
    categories: (q.question_categories || []).map((qc) => ({
      id: qc.category_id,
      name: qc.categories?.name || "Unknown",
      assignedBy: userMap[qc.assigned_by] || null,
    })),
  }));
}

module.exports = {
  saveTelegramQuestion,
  getAllQuestions,
  assignCategoryToQuestion,
  removeCategoryFromQuestion,
};