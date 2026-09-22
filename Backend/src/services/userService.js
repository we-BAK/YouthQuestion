const supabase = require("../config/supabase");

// ==========================================
// Get all users
// ==========================================
async function getAllUsers() {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// ==========================================
// Get active users only
// ==========================================
async function getActiveUsers() {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("status", "Active")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// ==========================================
// Update user status
// Active <-> Inactive
// ==========================================
async function updateUserStatus(userId, status) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  if (!["Active", "Inactive"].includes(status)) {
    throw new Error(
      "Status must be either Active or Inactive."
    );
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .update({
      status,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("User not found.");
  }

  return data;
}

// ==========================================
// Create new user
// Supabase Auth + user_profiles
// ==========================================
async function createNewUser(userData) {
  const {
    email,
    password,
    role,
    fullName,
    status,
  } = userData;

  // ------------------------------------------
  // Validate required fields
  // ------------------------------------------
  if (!email || !password || !fullName || !role) {
    throw new Error(
      "Email, password, full name, and role are required."
    );
  }

  // ------------------------------------------
  // 1. Get the selected role from DB
  // ------------------------------------------
  const {
    data: roleData,
    error: roleError,
  } = await supabase
    .from("roles")
    .select("id, code, name")
    .eq("code", role)
    .eq("is_active", true)
    .single();

  if (roleError || !roleData) {
    throw new Error(
      "The selected role is invalid or inactive."
    );
  }

  // ------------------------------------------
  // 2. Create user in Supabase Auth
  // ------------------------------------------
  const {
    data: authData,
    error: authError,
  } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  // ------------------------------------------
  // 3. Create user profile
  // ------------------------------------------
  const {
    data: profileData,
    error: profileError,
  } = await supabase
    .from("user_profiles")
    .insert([
      {
        id: authData.user.id,
        full_name: fullName,
        role: roleData.code,
        status: status || "Active",
      },
    ])
    .select()
    .single();

  // ------------------------------------------
  // 4. Cleanup Auth user if profile fails
  // ------------------------------------------
  if (profileError) {
    await supabase.auth.admin.deleteUser(
      authData.user.id
    );

    throw new Error(profileError.message);
  }

  // ------------------------------------------
  // 5. Return created user
  // ------------------------------------------
  return {
    ...profileData,
    email: authData.user.email,
    role_name: roleData.name,
  };
}

// ==========================================
// Create first Super Admin
// Protected by bootstrap secret
// ==========================================
async function createFirstSuperAdmin(userData, secret) {
  const BOOTSTRAP_SECRET =
    process.env.BOOTSTRAP_SECRET;

  if (
    !BOOTSTRAP_SECRET ||
    secret !== BOOTSTRAP_SECRET
  ) {
    throw new Error(
      "Invalid or missing bootstrap secret."
    );
  }

  const {
    email,
    password,
    fullName,
  } = userData;

  if (!email || !password || !fullName) {
    throw new Error(
      "Email, password, and full name are required."
    );
  }

  // ------------------------------------------
  // 1. Resolve Super Admin role from DB
  // ------------------------------------------
  const {
    data: roleData,
    error: roleError,
  } = await supabase
    .from("roles")
    .select("id, code, name")
    .eq("is_super_admin", true)
    .eq("is_active", true)
    .maybeSingle();

  if (roleError || !roleData) {
    throw new Error(
      "No active Super Admin role found in the database. Please seed the roles table first."
    );
  }

  // ------------------------------------------
  // 2. Create Supabase Auth user
  // ------------------------------------------
  const {
    data: authData,
    error: authError,
  } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  // ------------------------------------------
  // 3. Create user profile
  // ------------------------------------------
  const {
    data: profileData,
    error: profileError,
  } = await supabase
    .from("user_profiles")
    .insert([
      {
        id: authData.user.id,
        full_name: fullName,
        role: roleData.code,
        status: "Active",
      },
    ])
    .select()
    .single();

  // ------------------------------------------
  // 4. Rollback Auth user if profile fails
  // ------------------------------------------
  if (profileError) {
    await supabase.auth.admin.deleteUser(
      authData.user.id
    );

    throw new Error(profileError.message);
  }

  // ------------------------------------------
  // 5. Return created user
  // ------------------------------------------
  return {
    ...profileData,
    email: authData.user.email,
    role_name: roleData.name,
  };
}

// ==========================================
// Exports
// ==========================================
module.exports = {
  getAllUsers,
  getActiveUsers,
  updateUserStatus,
  createNewUser,
  createFirstSuperAdmin,
};