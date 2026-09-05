function requireBotKey(req, res, next) {
  const providedKey = req.headers["x-bot-api-key"];

  if (
    !providedKey ||
    providedKey !== process.env.BOT_API_KEY
  ) {
    return res.status(401).json({
      error: "Invalid bot API key",
    });
  }

  next();
}

module.exports = requireBotKey;