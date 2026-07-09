const {
    OVERVIEW_MAX_LENGTH
} = require("../config/constants");

function truncate(text = "", length = OVERVIEW_MAX_LENGTH) {
    if (!text) {
        return "No description available.";
    }

    return text.length <= length
        ? text
        : `${text.slice(0, length)}...`;
}

function movieCaption(movie) {

    const year = movie.release_date
        ? movie.release_date.substring(0, 4)
        : "N/A";

    const language =
        movie.original_language
            ? movie.original_language.toUpperCase()
            : "N/A";

    const genres =
        movie.genres
            ? movie.genres.map(g => g.name).join(", ")
            : "Unknown";

    return `
🎬 <b>${movie.title}</b>

📅 <b>Year:</b> ${year}

⭐ <b>Rating:</b> ${movie.vote_average}/10

👥 <b>Votes:</b> ${movie.vote_count}

🌍 <b>Language:</b> ${language}

🎭 <b>Genres:</b> ${genres}

🔥 <b>Popularity:</b> ${Math.round(movie.popularity)}

📝 <b>Overview</b>

${truncate(movie.overview)}
`;
}

module.exports = {
    movieCaption,
    truncate
};