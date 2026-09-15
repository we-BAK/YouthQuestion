const express = require("express");
const router = express.Router();
const programService = require("../services/programService");
const { assignCategoryToProgram, getProgramQuestions } = programService;


router.get("/", async (req, res) => {
  try {
    const programs = await programService.getAllPrograms(req.query);
    res.json(programs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/outcomes", async (_req, res) => {
  try {
    const outcomes = await programService.getProgramOutcomes();
    res.json(outcomes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/questions/:programQuestionId", async (req, res) => {
  try {
    const updated = await programService.updateQuestionOutcome(
      req.params.programQuestionId,
      req.body
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const program = await programService.createProgram(req.body);
    res.status(201).json(program);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/programs/:id/categories — assign a category and auto-link its questions
router.post("/:id/categories", async (req, res) => {
  try {
    const { categoryId } = req.body;
    if (!categoryId) {
      return res.status(400).json({ error: "categoryId is required" });
    }
    const result = await assignCategoryToProgram(req.params.id, categoryId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/programs/:id/questions — get all questions linked to a program
router.get("/:id/questions", async (req, res) => {
  try {
    const questions = await getProgramQuestions(req.params.id);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const program = await programService.getProgramById(req.params.id);
    res.json(program);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;