// src/controllers/questionController.js
const {
  getAllQuestions,
  saveTelegramQuestion,
  assignCategoryToQuestion,
  removeCategoryFromQuestion,
} = require("../services/questionService");

async function getQuestions(req, res) {
  try {
    const questions = await getAllQuestions();
    res.json(questions);
  } catch (error) {
    console.error("❌ Failed to get questions:", error);
    res.status(500).json({ error: error.message });
  }
}

async function createQuestion(req, res) {
  try {
    const { message, question } = req.body;
    const result = await saveTelegramQuestion(message, question);
    res.status(201).json(result);
  } catch (error) {
    console.error("❌ Failed to create question:", error);
    res.status(400).json({ error: error.message });
  }
}

async function addCategory(req, res) {
  try {
    const { id } = req.params;
    const { categoryId } = req.body;

    // Use profile ID from middleware
    const adminUserId = req.profile?.id || req.user?.id;

    if (!categoryId) {
      return res.status(400).json({ error: "categoryId is required" });
    }

    const result = await assignCategoryToQuestion(id, categoryId, adminUserId);
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Failed to assign category:", error);
    res.status(400).json({ error: error.message });
  }
}

async function removeCategory(req, res) {
  try {
    const { id, categoryId } = req.params;
    await removeCategoryFromQuestion(id, categoryId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Failed to remove category:", error);
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getQuestions,
  createQuestion,
  addCategory,
  removeCategory,
};