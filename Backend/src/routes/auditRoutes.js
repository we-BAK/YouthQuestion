// src/routes/auditRoutes.js
const express = require("express");
const router = express.Router();
const { fetchAuditLogs } = require("../controllers/auditController");
const requireSuperAdmin = require("../middleware/requireSuperAdmin");

// GET /api/audit-logs
router.get("/", requireSuperAdmin, fetchAuditLogs);

module.exports = router;