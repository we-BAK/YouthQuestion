import { supabase } from "../lib/supabase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function getHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("No active authentication session.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };
}

// GET /api/categories — requires CATEGORIES_VIEW permission
export async function getCategories() {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/api/categories`, { headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load categories");
  return data;
}

// POST /api/categories — requires CATEGORIES_CREATE permission
export async function addCategory(name) {
  const res = await fetch(`${API_URL}/api/categories`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create category");
  return data;
}