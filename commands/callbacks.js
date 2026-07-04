const {
    searchMovie,
    getMoviesByGenre,
    getTrendingMovies,
    getGenres
} = require('../services/tmdb');

const {
    movieCard
} = require('../utils/formatter');

// Search movie
const userState = {}; 

module.exports = (bot) => {

    // Handle button clicks
    bot.on('callback_query', async (query) => {

        const chatId = query.message.chat.id;
        const data = query.data;

        bot.answerCallbackQuery(query.id);

        // ───────────────────────
        // SEARCH MODE
        // ───────────────────────
        if (data === "search") {

            userState[chatId] = "searching";

            return bot.sendMessage(
                chatId,
                "🔍 Send a movie name:"
            );
        }

        // ───────────────────────
        // GENRES MENU (DYNAMIC)
        // ───────────────────────
        if (data === "genres") {

            const genres = await getGenres();

            const buttons = [];

            for (let i = 0; i < genres.length; i += 2) {

                buttons.push(
                    genres.slice(i, i + 2).map(g => ({
                        text: `🎬 ${g.name}`,
                        callback_data: `g_${g.id}`
                    }))
                );
            }

            return bot.sendMessage(
                chatId,
                "🎭 Choose a genre:",
                {
                    reply_markup: {
                        inline_keyboard: buttons
                    }
                }
            );
        }

        // ───────────────────────
        // GENRE RESULTS
        // ───────────────────────
        if (data.startsWith("g_")) {

            const genreId = data.split("_")[1];

            const movies =
                await getMoviesByGenre(genreId);

            let text = "🎬 *Top Movies*\n\n";

            movies.slice(0, 5).forEach((m, i) => {
                text += `${i + 1}. 🎬 ${m.title}\n⭐ ${m.vote_average}/10\n\n`;
            });

            return bot.sendMessage(chatId, text, {
                parse_mode: "Markdown"
            });
        }

        // ───────────────────────
        // TRENDING
        // ───────────────────────
        if (data === "trending") {

            const movies = await getTrendingMovies();

            let text = "🔥 *Trending Movies*\n\n";

            movies.slice(0, 5).forEach((m, i) => {
                text += `${i + 1}. 🎬 ${m.title}\n⭐ ${m.vote_average}/10\n\n`;
            });

            return bot.sendMessage(chatId, text, {
                parse_mode: "Markdown"
            });
        }
    });

    // ─────────────────────────────
    // TEXT HANDLER (SEARCH INPUT)
    // ─────────────────────────────
    bot.on("message", async (msg) => {

        const chatId = msg.chat.id;
        const text = msg.text;

        if (!text || text.startsWith("/")) return;

        if (userState[chatId] !== "searching") return;

        userState[chatId] = null;

        const movies = await searchMovie(text);

        if (!movies.length) {
            return bot.sendMessage(chatId, "❌ Movie not found");
        }

        const movie = movies[0];

        const poster = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null;

        if (poster) {
            return bot.sendPhoto(
                chatId,
                poster,
                {
                    caption: movieCard(movie),
                    parse_mode: "Markdown"
                }
            );
        }

        return bot.sendMessage(
            chatId,
            movieCard(movie),
            { parse_mode: "Markdown" }
        );
    });

};