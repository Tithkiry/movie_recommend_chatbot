require('dotenv').config();

const express = require('express');
const TelegramBot = require('node-telegram-bot-api').default;

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('MovieBot running');
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

const bot = new TelegramBot(
    process.env.BOT_TOKEN,
    { polling: true }
);

console.log("🎬 MovieBot is running...");

require('./commands/start')(bot);
require('./commands/callbacks')(bot);