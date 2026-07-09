require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api").default;

const { PORT, BOT_TOKEN } = require("./config/constants");

const app = express();

app.get("/", (req, res) => {
    res.send("🎬 MovieBot is running.");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const bot = new TelegramBot(BOT_TOKEN, {
    polling: true
});

console.log("🎬 MovieBot started successfully.");

require("./commands/start")(bot);
require("./commands/callbacks")(bot);
require("./commands/messages")(bot);

process.on("SIGINT", () => {
    console.log("Stopping bot...");
    bot.stopPolling();
    process.exit(0);
});

process.on("SIGTERM", () => {
    console.log("Stopping bot...");
    bot.stopPolling();
    process.exit(0);
});