// src/services/auditService.js
const supabase = require("../config/supabase");

/**
 * Safely parses JSON payloads whether they are already objects or strings.
 */
function parsePayload(value) {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    return {};
  }
}

/**
 * Extract target profile ID from log entry or payload variations
 */
function extractUserId(log) {
  if (log.profile_id) return log.profile_id;

  const newVals = parsePayload(log.new_values);
  const oldVals = parsePayload(log.old_values);

  return (
    newVals.assigned_by ||
    newVals.created_by ||
    newVals.user_id ||
    oldVals.assigned_by ||
    oldVals.created_by ||
    oldVals.user_id ||
    null
  );
}

async function getAuditLogs(limit = 100) {
  const { data: logs, error } = await supabase
    .from("audit_logs")
    .select(`
      id,
      action,
      entity_type,
      entity_id,
      old_values,
      new_values,
      created_at,
      profile_id
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch audit logs: ${error.message}`);
  }

  // 1. Extract all user UUIDs across both old_values and new_values
  const rawUserIds = logs.map((log) => extractUserId(log)).filter(Boolean);
  const profileIds = [...new Set(rawUserIds)];

  // 2. Fetch profiles using join/query matching your working SQL query
  const profileMap = {};

  if (profileIds.length > 0) {
    // Attempt fetching from user_profiles table
    const { data: profiles, error: profileError } = await supabase
      .from("user_profiles")
      .select("id, full_name")
      .in("id", profileIds);

    if (profileError) {
      console.error("❌ Error querying user_profiles:", profileError.message);
    }

    if (profiles && profiles.length > 0) {
      profiles.forEach((p) => {
        if (p.id) {
          profileMap[p.id] = p.full_name;
        }
      });
    }
  }

  // 3. Construct clean response payload for frontend
  return logs.map((log) => {
    const userId = extractUserId(log);
    const resolvedName = userId ? profileMap[userId] : null;

    return {
      id: log.id,
      action: log.action,
      entityType: log.entity_type,
      entityId: log.entity_id,
      oldValues: parsePayload(log.old_values),
      newValues: parsePayload(log.new_values),
      createdAt: log.created_at,
      performedBy: resolvedName || "System / Anonymous",
    };
  });
}

module.exports = { getAuditLogs };