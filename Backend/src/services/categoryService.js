const supabase = require("../config/supabase");

async function createCategory(name) {
  const { data, error } = await supabase
    .from("categories")
    .insert([{ name }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

module.exports = { createCategory, getCategories };