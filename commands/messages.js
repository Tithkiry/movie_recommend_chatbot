const {
    searchMovie
} = require("../services/tmdb");

const {
    getState,
    clearState
} = require("../state/userState");

const {
    searchResultsKeyboard
} = require("../utils/keyboards");

const {
    SEARCH_RESULTS_LIMIT
} = require("../config/constants");


module.exports = (bot) => {

    bot.on(
        "message",
        async (msg) => {

            const chatId =
                msg.chat.id;

            const text =
                msg.text;


            if (!text) {
                return;
            }


            if (text.startsWith("/")) {
                return;
            }


            const state =
                getState(chatId);


            if (state !== "searching") {
                return;
            }


            clearState(chatId);


            const movies =
                await searchMovie(text);


            const results =
                movies.slice(
                    0,
                    SEARCH_RESULTS_LIMIT
                );


            if (!results.length) {

                return bot.sendMessage(
                    chatId,
                    "❌ No movies found."
                );
            }


            return bot.sendMessage(
                chatId,
                "🎬 Select a movie:",
                {
                    reply_markup:
                        searchResultsKeyboard(
                            results
                        )
                }
            );

        }
    );

};