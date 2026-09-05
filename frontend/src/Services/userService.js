import { supabase } from "../lib/supabase";

const API_URL = import.meta.env.VITE_API_URL;

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

// Get all registered users
export async function getUsers() {
  const response = await fetch(`${API_URL}/api/users`, {
    headers: await getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Unable to load users");
  }

  // Normalize backend data
  return result.map((user) => ({
    ...user,
    name: user.name || user.full_name || user.fullName,
    email: user.email,
    role: user.role || user.role_name || "User",
    status: user.status || (user.is_active ? "Active" : "Inactive"),
    created: user.created || user.created_at,
    lastLogin: user.lastLogin || user.last_login,
  }));
}

// Get active users only
export async function getActiveUsers() {
  const response = await fetch(`${API_URL}/api/users/active`, {
    headers: await getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Unable to load active users");
  }

  return result.map((user) => ({
    ...user,
    name: user.name || user.full_name || user.fullName,
    email: user.email,
    role: user.role || user.role_name || "User",
    status: user.status || (user.is_active ? "Active" : "Inactive"),
    created: user.created || user.created_at,
    lastLogin: user.lastLogin || user.last_login,
  }));
}

// Register a new user
export async function createUser(payload) {
  const response = await fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Unable to create user");
  }

  return result;
}