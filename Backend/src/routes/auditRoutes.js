// src/routes/auditRoutes.js
const express = require("express");
const router = express.Router();
const { fetchAuditLogs } = require("../controllers/auditController");
const requirePermission = require("../middleware/requirePermission");

// GET /api/audit-logs
router.get("/", requirePermission("AUDIT_LOGS_VIEW"), fetchAuditLogs);

module.exports = router;