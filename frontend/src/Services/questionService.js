// frontend/src/services/questionService.js
import { supabase } from "../lib/supabase"; // Adjust path to your Supabase client setup

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("No active authentication session.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };
}

export async function fetchQuestions() {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}/api/questions`, {
    method: "GET",
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to load questions");
  }

  return data;
}