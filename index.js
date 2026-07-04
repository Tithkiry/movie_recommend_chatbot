require('dotenv').config();

const TelegramBot =
    require('node-telegram-bot-api').default;

const bot = new TelegramBot(
    process.env.BOT_TOKEN,
    { polling: true }
);

console.log("🎬 MovieBot is running...");

require('./commands/start')(bot);
require('./commands/callbacks')(bot);