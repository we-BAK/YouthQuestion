// src/services/auditService.js
const supabase = require("../config/supabase");

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

  // Extract unique profile IDs to get user details
  const profileIds = [
    ...new Set(logs.map((log) => log.profile_id).filter(Boolean)),
  ];

  const profileMap = {};
  if (profileIds.length > 0) {
    const { data: profiles } = await supabase
      .from("user_profiles")
      .select("id, full_name, email")
      .in("id", profileIds);

    if (profiles) {
      profiles.forEach((p) => {
        profileMap[p.id] = p.full_name || p.email;
      });
    }
  }

  // Format and enrich log records
  return logs.map((log) => ({
    id: log.id,
    action: log.action,
    entityType: log.entity_type,
    entityId: log.entity_id,
    oldValues: log.old_values,
    newValues: log.new_values,
    createdAt: log.created_at,
    performedBy: profileMap[log.profile_id] || "System / Anonymous",
  }));
}

module.exports = { getAuditLogs };