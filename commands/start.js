module.exports = (bot) => {

    bot.onText(/\/start/, (msg) => {

        bot.sendMessage(
            msg.chat.id,
            "🎬 *Welcome to MovieBot*\nChoose an option:",
            {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "🔍 Search Movie",
                                callback_data: "search"
                            }
                        ],
                        [
                            {
                                text: "🎭 Browse Genres",
                                callback_data: "genres"
                            }
                        ],
                        [
                            {
                                text: "🔥 Trending Movies",
                                callback_data: "trending"
                            }
                        ]
                    ]
                }
            }
        );
    });

};