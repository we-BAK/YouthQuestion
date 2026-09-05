// src/services/userService.js
const supabase = require("../config/supabase");

// Get all users
async function getAllUsers() {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*");

  if (error) throw new Error(error.message);
  return data;
}

// Get active users only
async function getActiveUsers() {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("status", "Active");

  if (error) throw new Error(error.message);
  return data;
}

// Create new user (via Supabase Auth + user_profiles table)
async function createNewUser(userData) {
  const { email, password, role, fullName, status } = userData;

  // 1. Create auth user in Supabase
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) throw new Error(authError.message);

  // 2. Insert into custom user_profiles table matching your DB columns
  const { data, error } = await supabase
    .from("user_profiles")
    .insert([
      {
        id: authData.user.id,
        email,
        full_name: fullName,
        role: role || "Reviewer",
        status: status || "Active",
      },
    ])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

module.exports = {
  getAllUsers,
  getActiveUsers,
  createNewUser,
};