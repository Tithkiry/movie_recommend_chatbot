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

module.exports = {
    searchMovie,
    getMoviesByGenre,
    getTrendingMovies,
    getGenres
};