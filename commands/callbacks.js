const {
  getMovieDetails,
  getMovieTrailer,
  getSimilarMovies,
  getGenres,
  getMoviesByGenre,
  getTrendingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getPopularMovies,
} = require("../services/tmdb");

const { movieCaption } = require("../utils/formatter");
const {
  genresKeyboard,
  movieKeyboard,
  movieListKeyboard,
  
} = require("../utils/keyboards");

const { clearState, setState } = require("../state/userState");

const { showMainMenu } = require("./start");

const {
  IMAGE_BASE_URL,
  SEARCH_RESULTS_LIMIT,
  SIMILAR_RESULTS_LIMIT,
} = require("../config/constants");

// ==============================
// Send Single Movie Details
// ==============================

async function sendMovieDetails(bot, chatId, movieId) {
  try {
    const movie = await getMovieDetails(movieId);

    if (!movie) {
      return bot.sendMessage(chatId, "❌ Movie details unavailable.");
    }

    const trailer = await getMovieTrailer(movieId);

    const poster = movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : null;

    const options = {
      parse_mode: "HTML",
      reply_markup: movieKeyboard(movieId, trailer),
    };

    if (poster) {
      return bot.sendPhoto(chatId, poster, {
        caption: movieCaption(movie),
        ...options,
      });
    }

    return bot.sendMessage(chatId, movieCaption(movie), options);
  } catch (error) {
    console.error("Movie details error:", error);

    return bot.sendMessage(chatId, "⚠️ Unable to load movie details.");
  }
}

// ==============================
// Send Movie List
// ==============================

async function sendMovieList(
  bot,
  chatId,
  movies,
  title,
  limit = SEARCH_RESULTS_LIMIT,
) {
  if (!movies || !movies.length) {
    return bot.sendMessage(chatId, "❌ No movies found.");
  }

  const filteredMovies = movies.slice(0, limit);

  return bot.sendMessage(chatId, title, {
    reply_markup: movieListKeyboard(filteredMovies),
  });
}

// ==============================
// Callback Handler
// ==============================

module.exports = (bot) => {
  bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    try {
      // Remove Telegram loading animation
      await bot.answerCallbackQuery(query.id);

      // ======================
      // HOME BUTTON
      // ======================

      if (data === "home") {
        clearState(chatId);

        return showMainMenu(bot, chatId);
      }

      // ======================
      // SEARCH MOVIE
      // ======================

      if (data === "search") {
        setState(chatId, "searching");

        return bot.sendMessage(chatId, "🔍 Send me a movie name:");
      }

      // ======================
      // TOP RATED
      // ======================

      if (data === "top_rated") {
        const movies = await getTopRatedMovies();

        return sendMovieList(bot, chatId, movies, "🏆 Top Rated Movies:");
      }

      // ======================
      // UPCOMING
      // ======================

      if (data === "upcoming") {
        const movies = await getUpcomingMovies();

        return sendMovieList(bot, chatId, movies, "🆕 Upcoming Movies:");
      }

      // ======================
      // RANDOM MOVIE
      // ======================

      if (data === "random") {
        const movies = await getPopularMovies();

        if (!movies || !movies.length) {
          return bot.sendMessage(chatId, "❌ Unable to find a movie.");
        }

        const randomMovie = movies[Math.floor(Math.random() * movies.length)];

        return sendMovieDetails(bot, chatId, randomMovie.id);
      }

      // ======================
      // MOVIE SELECTED
      // ======================

      if (data.startsWith("movie_")) {
        const movieId = data.split("_")[1];

        clearState(chatId);

        return sendMovieDetails(bot, chatId, movieId);
      }

      // ======================
      // SIMILAR MOVIES
      // ======================

      if (data.startsWith("similar_")) {
        const movieId = data.split("_")[1];

        const movies = await getSimilarMovies(movieId);

        return sendMovieList(
          bot,
          chatId,
          movies,
          "🎯 Similar Movies:",
          SIMILAR_RESULTS_LIMIT,
        );
      }

      // ======================
      // GENRE MENU
      // ======================

      if (data === "genres") {
        const genres = await getGenres();

        if (!genres || !genres.length) {
          return bot.sendMessage(chatId, "❌ No genres available.");
        }

        return bot.sendMessage(chatId, "🎭 Choose a genre:", {
          reply_markup: genresKeyboard(genres),
        });
      }

      // ======================
      // GENRE SELECTED
      // ======================

      if (data.startsWith("genre_")) {
        const genreId = data.split("_")[1];

        const movies = await getMoviesByGenre(genreId);

        return sendMovieList(bot, chatId, movies, "🎬 Movies:");
      }

      // ======================
      // TRENDING
      // ======================

      if (data === "trending") {
        const movies = await getTrendingMovies();

        return sendMovieList(bot, chatId, movies, "🔥 Trending Movies:");
      }
      
    } catch (error) {
      console.error("Callback error:", error);

      await bot.sendMessage(
        chatId,
        "⚠️ Something went wrong. Please try again later.",
      );
    }
  });
};
