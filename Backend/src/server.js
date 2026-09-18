require("dotenv").config();

const app = require("./app");

console.log("🟡 server.js started");
console.log("🟡 About to load Telegram bot...");

require("./bot/telegramBot");

console.log("🟢 Telegram bot file loaded successfully");

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on 0.0.0.0:${PORT}`);
});