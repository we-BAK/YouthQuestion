const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const auditRoutes = require("./routes/auditRoutes");
const programRoutes = require("./routes/programRoutes");
const { getProgramOutcomes } = require("./services/programService");
const { getCategories, createCategory } = require("./services/categoryService");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/questions",
  questionRoutes
);

app.use(
  "/api/programs",
  programRoutes
);

app.use(
  "/api/audit-logs",
  auditRoutes
);

app.get("/api/program-outcomes", async (_req, res) => {
  try {
    const outcomes = await getProgramOutcomes();
    res.json(outcomes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/categories", async (_req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/categories", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Category name is required" });
    }
    const category = await createCategory(name.trim());
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

module.exports = app;