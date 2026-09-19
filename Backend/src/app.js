const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const auditRoutes = require("./routes/auditRoutes");
const programRoutes = require("./routes/programRoutes");

const { getProgramOutcomes } = require("./services/programService");
const {
  getCategories,
  createCategory,
} = require("./services/categoryService");

const requirePermission = require("./middleware/requirePermission");

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

// CORS
app.use(
  cors({
    origin: allowedOrigins,
  })
);

// Parse JSON
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

app.use("/api/questions", questionRoutes);

app.use("/api/programs", programRoutes);

app.use("/api/audit-logs", auditRoutes);

// Program outcomes
app.get(
  "/api/program-outcomes",
  requirePermission("PROGRAMS_VIEW"),
  async (_req, res) => {
    try {
      const outcomes = await getProgramOutcomes();
      res.json(outcomes);
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

// Categories
app.get(
  "/api/categories",
  requirePermission("CATEGORIES_VIEW"),
  async (_req, res) => {
    try {
      const categories = await getCategories();
      res.json(categories);
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

app.post(
  "/api/categories",
  requirePermission("CATEGORIES_CREATE"),
  async (req, res) => {
    try {
      const { name } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({
          error: "Category name is required",
        });
      }

      const category = await createCategory(name.trim());

      res.status(201).json(category);
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

module.exports = app;