// src/controllers/auditController.js
const { getAuditLogs } = require("../services/auditService");

async function fetchAuditLogs(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = await getAuditLogs(limit);
    res.status(200).json(logs);
  } catch (error) {
    console.error("❌ Error fetching audit logs:", error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { fetchAuditLogs };