// src/services/questionService.js
const supabase = require("../config/supabase");

async function getAllQuestions() {
  const { data, error } = await supabase
    .from("QUESTIONS") // Adjust table name to match your DB schema
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

module.exports = {
  getAllQuestions,
};