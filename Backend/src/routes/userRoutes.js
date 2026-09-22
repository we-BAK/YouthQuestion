const express = require("express");

const {
  getUsers,
  getActiveUsersList,
  createUser,
  bootstrapSuperAdmin,
  updateUserStatus,
} = require("../controllers/userController");

const requirePermission = require("../middleware/requirePermission");

const router = express.Router();

// ==========================================
// Get all users
// ==========================================
router.get(
  "/",
  requirePermission("USERS_VIEW"),
  getUsers
);

// ==========================================
// Get active users only
// ==========================================
router.get(
  "/active",
  requirePermission("USERS_VIEW"),
  getActiveUsersList
);

// ==========================================
// Create a new user
// ==========================================
router.post(
  "/",
  requirePermission("USERS_CREATE"),
  createUser
);

// ==========================================
// Update user status
// Active <-> Inactive
// ==========================================
router.patch(
  "/:id/status",
  requirePermission("USERS_UPDATE"),
  updateUserStatus
);

// ==========================================
// Create the first Super Admin
// ==========================================
router.post(
  "/bootstrap",
  bootstrapSuperAdmin
);

module.exports = router;