// src/routes/questionRoutes.js
const express = require("express");
const router = express.Router();

// Import controller functions (names MUST match module.exports in questionController.js)
const {
  getQuestions,
  createQuestion,
  addCategory,
  removeCategory,
} = require("../controllers/questionController");

// Import middleware
const requireSuperAdmin = require("../middleware/requireSuperAdmin");

// GET /api/questions
router.get("/", requireSuperAdmin, getQuestions);

// POST /api/questions
router.post("/", createQuestion);

// POST /api/questions/:id/categories
router.post("/:id/categories", requireSuperAdmin, addCategory);

// DELETE /api/questions/:id/categories/:categoryId
router.delete("/:id/categories/:categoryId", requireSuperAdmin, removeCategory);

module.exports = router;