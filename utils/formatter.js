function movieCard(movie) {

    const year =
        movie.release_date
            ? movie.release_date.slice(0, 4)
            : "N/A";

    return `
🎬 *${movie.title}*

📅 ${year}
⭐ ${movie.vote_average}/10
🔥 Popularity: ${Math.round(movie.popularity)}

📝 ${movie.overview.slice(0, 150)}...
`;
}

module.exports = {
    movieCard
};