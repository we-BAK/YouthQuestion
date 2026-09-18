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
const requirePermission = require("../middleware/requirePermission");

// GET /api/questions
router.get("/", requirePermission("QUESTIONS_VIEW"), getQuestions);

// POST /api/questions
router.post("/", createQuestion);

// POST /api/questions/:id/categories
router.post("/:id/categories", requirePermission("QUESTIONS_CATEGORIZE"), addCategory);

// DELETE /api/questions/:id/categories/:categoryId
router.delete("/:id/categories/:categoryId", requirePermission("QUESTIONS_CATEGORIZE"), removeCategory);

module.exports = router;