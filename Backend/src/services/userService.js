// src/services/userService.js
const supabase = require

// Get all users
async function getAllUsers() {
  const { data, error } = await supabase
    .from('PROFILE') 
    .select('*');

  if (error) throw new Error(error.message);
  return data;
}

// Get active users only
async function getActiveUsers() {
  const { data, error } = await supabase
    .from('PROFILE') 
    .select('*')
    .eq('is_active', true); // or status = 'ACTIVE' depending on your column

  if (error) throw new Error(error.message);
  return data;
}

// Create new user (via Supabase Auth + PROFILE table)
async function createNewUser(userData) {
  const { email, password, role } = userData;

  // 1. Create auth user using Supabase Service Role Key
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) throw new Error(authError.message);

  // 2. Insert into your custom user/profile table
  const { data, error } = await supabase
    .from('PROFILE')
    .insert([
      {
        id: authData.user.id,
        email,
        role_id: role,
        is_active: true,
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