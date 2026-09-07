// src/services/auditService.js
const supabase = require("../config/supabase");

async function logUserAction({ profileId, action, entityType = null, entityId = null, oldValues = null, newValues = null }) {
  const { error } = await supabase.from("audit_logs").insert({
    profile_id: profileId,
    action: action,               // e.g., 'EXPORT_REPORT', 'LOGIN', 'ASSIGN_CATEGORY'
    entity_type: entityType,       // e.g., 'question', 'user'
    entity_id: entityId,
    old_values: oldValues,
    new_values: newValues,
  });

  if (error) {
    console.error("❌ Failed to create audit log entry:", error.message);
  }
}

module.exports = { logUserAction };