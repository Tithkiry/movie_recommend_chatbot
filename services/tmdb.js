const axios = require("axios");

const {
    TMDB_API_KEY,
    TMDB_BASE_URL
} = require("../config/constants");

const api = axios.create({
    baseURL: TMDB_BASE_URL,
    timeout: 10000,
    params: {
        api_key: TMDB_API_KEY
    }
});

/**
 * Executes a TMDB request safely.
 */
async function request(url, params = {}) {
    try {
        const response = await api.get(url, {
            params
        });

        return response.data;
    } catch (error) {
        console.error(
            "[TMDB]",
            error.response?.status,
            error.response?.data || error.message
        );

        return null;
    }
}

/**
 * Search movies by title.
 */
async function searchMovie(query) {
    const data = await request("/search/movie", {
        query,
        include_adult: false
    });

    return data?.results ?? [];
}

/**
 * Movie details.
 */
async function getMovieDetails(movieId) {
    return await request(`/movie/${movieId}`);
}

/**
 * Official trailer.
 */
async function getMovieTrailer(movieId) {
    const data = await request(`/movie/${movieId}/videos`);

    if (!data) return null;

    const videos = data.results ?? [];

    const official = videos.find(video =>
        video.site === "YouTube" &&
        video.type === "Trailer" &&
        video.official
    );

    const trailer =
        official ||
        videos.find(video =>
            video.site === "YouTube" &&
            video.type === "Trailer"
        );

    if (!trailer) {
        return null;
    }

    return `https://www.youtube.com/watch?v=${trailer.key}`;
}

/**
 * Similar movies.
 */
async function getSimilarMovies(movieId) {
    const data = await request(`/movie/${movieId}/similar`);

    return data?.results ?? [];
}

/**
 * Trending movies.
 */
async function getTrendingMovies() {
    const data = await request("/trending/movie/week");

    return data?.results ?? [];
}

/**
 * Top Rated.
 */
async function getTopRatedMovies() {
    const data = await request("/movie/top_rated");

    return data?.results ?? [];
}

/**
 * Upcoming.
 */
async function getUpcomingMovies() {
    const data = await request("/movie/upcoming");

    return data?.results ?? [];
}

/**
 * Genres.
 */
async function getGenres() {
    const data = await request("/genre/movie/list");

    return data?.genres ?? [];
}

/**
 * Movies in a genre.
 */
async function getMoviesByGenre(genreId, page = 1) {
    const data = await request("/discover/movie", {
        with_genres: genreId,
        page,
        sort_by: "popularity.desc"
    });

    return data?.results ?? [];
}

/**
 * Popular movies.
 */
async function getPopularMovies(page = 1) {
    const data = await request("/movie/popular", {
        page
    });

    return data?.results ?? [];
}

/**
 * Now Playing.
 */
async function getNowPlayingMovies(page = 1) {
    const data = await request("/movie/now_playing", {
        page
    });

    return data?.results ?? [];
}

/**
 * Recommendations from TMDB.
 */
async function getRecommendations(movieId) {
    const data = await request(`/movie/${movieId}/recommendations`);

    return data?.results ?? [];
}

/**
 * Credits (cast/director).
 */
async function getMovieCredits(movieId) {
    return await request(`/movie/${movieId}/credits`);
}

/**
 * Search an actor.
 */
async function searchPerson(name) {
    const data = await request("/search/person", {
        query: name
    });

    return data?.results ?? [];
}

/**
 * Movies from an actor.
 */
async function getPersonMovies(personId) {
    const data = await request(`/person/${personId}/movie_credits`);

    return data?.cast ?? [];
}

/**
 * Images.
 */
async function getMovieImages(movieId) {
    return await request(`/movie/${movieId}/images`);
}

/**
 * Watch providers.
 */
async function getWatchProviders(movieId) {
    return await request(`/movie/${movieId}/watch/providers`);
}

module.exports = {
    searchMovie,
    getMovieDetails,
    getMovieTrailer,
    getSimilarMovies,
    getRecommendations,
    getTrendingMovies,
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    getNowPlayingMovies,
    getGenres,
    getMoviesByGenre,
    getMovieCredits,
    searchPerson,
    getPersonMovies,
    getMovieImages,
    getWatchProviders
};