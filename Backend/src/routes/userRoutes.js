const express = require("express");

const {
  getUsers,
  getActiveUsersList, // <-- Imported
  createUser,
  bootstrapSuperAdmin,
} = require("../controllers/userController");

const requireSuperAdmin = require("../middleware/requireSuperAdmin");

const router = express.Router();

// Get all users
router.get(
  "/",
  requireSuperAdmin,
  getUsers
);

// Get active users only
router.get(
  "/active",
  requireSuperAdmin,
  getActiveUsersList
);

// Create a new user
router.post(
  "/",
  requireSuperAdmin,
  createUser
);

// Create the first Super Admin
router.post(
  "/bootstrap",
  bootstrapSuperAdmin
);

module.exports = router;