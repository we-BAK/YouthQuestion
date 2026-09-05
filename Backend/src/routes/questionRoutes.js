const express = require("express");

const {
  createQuestion,
} = require("../controllers/questionController");

const requireBotKey = require("../middleware/requireBotKey");

const router = express.Router();

router.post(
  "/",
  requireBotKey,
  createQuestion
);

module.exports = router;