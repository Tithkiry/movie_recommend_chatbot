const {
    mainMenuKeyboard
} = require("../utils/keyboards");

/**
 * Displays the bot's main menu.
 */
async function showMainMenu(bot, chatId, firstName = "") {

    const greeting = firstName
        ? `Hi ${firstName}! 👋`
        : "Welcome! 👋";

    await bot.sendMessage(
        chatId,
`
🎬 <b>MovieBot</b>

${greeting}

I can help you discover movies.

Choose one of the options below.
`,
        {
            parse_mode: "HTML",
            reply_markup: mainMenuKeyboard()
        }
    );
}

module.exports = (bot) => {

    bot.onText(/^\/start$/, async (msg) => {

        await showMainMenu(
            bot,
            msg.chat.id,
            msg.from.first_name
        );

    });

};

module.exports.showMainMenu = showMainMenu;