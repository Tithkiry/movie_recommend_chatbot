require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || 3000,

    BOT_TOKEN: process.env.BOT_TOKEN,

    TMDB_API_KEY: process.env.TMDB_API_KEY,

    TMDB_BASE_URL: "https://api.themoviedb.org/3",

    IMAGE_BASE_URL: "https://image.tmdb.org/t/p/w500",

    SEARCH_RESULTS_LIMIT: 5,

    GENRE_RESULTS_LIMIT: 5,

    TRENDING_RESULTS_LIMIT: 5,

    SIMILAR_RESULTS_LIMIT: 5,

    OVERVIEW_MAX_LENGTH: 350
};