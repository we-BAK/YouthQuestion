import { supabase } from "../lib/supabase";

const API_URL = import.meta.env.VITE_API_URL;

// ==========================================
// Get authentication headers
// ==========================================
async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Please sign in first.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };
}

// ==========================================
// Normalize user data
// ==========================================
function normalizeUser(user) {
  return {
    ...user,
    name:
      user.name ||
      user.full_name ||
      user.fullName ||
      "Unknown User",

    email: user.email || "",

    role:
      user.role ||
      user.role_name ||
      "User",

    status:
      user.status ||
      (user.is_active
        ? "Active"
        : "Inactive"),

    created:
      user.created ||
      user.created_at ||
      null,

    lastLogin:
      user.lastLogin ||
      user.last_login ||
      null,
  };
}

// ==========================================
// Get all registered users
// ==========================================
export async function getUsers() {
  const response = await fetch(
    `${API_URL}/api/users`,
    {
      method: "GET",
      headers: await getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error ||
        "Unable to load users."
    );
  }

  if (!Array.isArray(result)) {
    throw new Error(
      "Invalid users response from server."
    );
  }

  return result.map(normalizeUser);
}

// ==========================================
// Get active users only
// ==========================================
export async function getActiveUsers() {
  const response = await fetch(
    `${API_URL}/api/users/active`,
    {
      method: "GET",
      headers: await getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error ||
        "Unable to load active users."
    );
  }

  if (!Array.isArray(result)) {
    throw new Error(
      "Invalid active users response from server."
    );
  }

  return result.map(normalizeUser);
}

// ==========================================
// Register a new user
// ==========================================
export async function createUser(payload) {
  const response = await fetch(
    `${API_URL}/api/users`,
    {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error ||
        "Unable to create user."
    );
  }

  return result;
}

// ==========================================
// Update user status
// Active <-> Inactive
// ==========================================
export async function updateUserStatus(
  userId,
  status
) {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  if (
    !["Active", "Inactive"].includes(status)
  ) {
    throw new Error(
      "Status must be either Active or Inactive."
    );
  }

  const response = await fetch(
    `${API_URL}/api/users/${userId}/status`,
    {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        status,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error ||
        "Unable to update user status."
    );
  }

  return normalizeUser(result);
}