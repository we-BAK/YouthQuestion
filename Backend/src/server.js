require("dotenv").config();

const app = require("./app");

console.log("🟡 server.js started");

console.log("🟡 About to load Telegram bot...");

require("./bot/telegramBot");

console.log("🟢 Telegram bot file loaded successfully");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});