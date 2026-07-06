const axios = require('axios');

require('dotenv').config();

const BASE = "https://api.themoviedb.org/3";

// SEARCH
async function searchMovie(name) {

    try {

        const res =
            await axios.get(
                `${BASE}/search/movie`,
                {
                    params: {
                        api_key: process.env.TMDB_API_KEY,
                        query: name
                    }
                }
            );

        return res.data.results;

    } catch (err) {

        console.log("TMDB ERROR:", err.response?.data || err.message);

        return `Error 404: Movie ${name} Not Found`;
    }
}

// GENRE
async function getMoviesByGenre(id) {

    const res =
        await axios.get(
            `${BASE}/discover/movie`,
            {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                    with_genres: id
                }
            }
        );

    return res.data.results;
}

// TRENDING
async function getTrendingMovies() {

    const res =
        await axios.get(
            `${BASE}/trending/movie/week`,
            {
                params: {
                    api_key: process.env.TMDB_API_KEY
                }
            }
        );

    return res.data.results;
}

// Fetch all movie genres from TMDB

async function getGenres() {

    const res =
        await axios.get(
            `${BASE}/genre/movie/list`,
            {
                params: {
                    api_key: process.env.TMDB_API_KEY
                }
            }
        );

    return res.data.genres;
}

// Get movie's trailer
async function getMovieTrailer(movieId) {
    try {
        const response = await axios.get(
            `${BASE_URL}/movie/${movieId}/videos`,
            {
                params: {
                    api_key: process.env.TMDB_API_KEY
                }
            }
        );

        const videos = response.data.results;

        // Find official YouTube trailer first
        const trailer = videos.find(v =>
            v.site === "YouTube" &&
            v.type === "Trailer" &&
            v.official === true
        );

        // If no official trailer, use any trailer
        const fallback = videos.find(v =>
            v.site === "YouTube" &&
            v.type === "Trailer"
        );

        const selected = trailer || fallback;

        return selected
            ? `https://www.youtube.com/watch?v=${selected.key}`
            : null;

    } catch (err) {
        console.error(err);
        return null;
    }
}

module.exports = {
    searchMovie,
    getMoviesByGenre,
    getTrendingMovies,
    getGenres,
    getMovieTrailer
};
