const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const auditRoutes = require("./routes/auditRoutes");

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
  "/api/audit-logs",
  auditRoutes
);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

module.exports = app;