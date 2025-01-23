import apikey from "./key.js";
const movieId = localStorage.getItem("selectedMovieId");

if (movieId) {
    localStorage.removeItem("selectedMovieId");
    async function loadMovieDetails() {
        try {
            const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apikey}&language=fr`;
            const response = await fetch(url);
            const movieData = await response.json();

            const poster = $("#movie-poster")[0];
            poster.src = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;

            const title = $("#movie-title")[0];
            title.textContent = movieData.title;
            $(title).addClass("black");

            const description = $("#movie-overview")[0];
            description.textContent = movieData.overview;
            $(description).addClass("black");

            const rating = $("#movie-rating")[0];
            rating.textContent = `Note moyenne : ${movieData.vote_average} / 10 (${movieData.vote_count} votes)`;
            $(rating).addClass("black");

            const genresList = $("#movie-genres")[0];
            movieData.genres.forEach((genre) => {
                const li = document.createElement("li");
                li.textContent = genre.name;
                $(li).addClass("black");
                genresList.appendChild(li);
            });

            const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apikey}&language=fr`;
            const creditsResponse = await fetch(creditsUrl);
            const creditsData = await creditsResponse.json();

            const actorsList = $("#movie-actors")[0];
            creditsData.cast.slice(0, 10).forEach((actor) => {
                const li = document.createElement("li");
                li.textContent = actor.name;
                $(li).addClass("black");
                actorsList.appendChild(li);
            });

            // Charger une seule bande-annonce
            const videosUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apikey}&language=fr`;
            const videosResponse = await fetch(videosUrl);
            const videosData = await videosResponse.json();

            const trailersList = $("#movie-trailers")[0];
            const trailer = videosData.results.find(video => video.type === "Trailer" && video.site === "YouTube");
            if (trailer) {
                const iframe = document.createElement("iframe");
                iframe.src = `https://www.youtube.com/embed/${trailer.key}`;
                iframe.width = "400";
                iframe.height = "250";
                iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                iframe.allowFullscreen = true;
                $(iframe).addClass("trailer-video");
                trailersList.appendChild(iframe);
            } else {
                console.log("Aucune bande-annonce trouvée pour ce film.");
            }
        } catch (error) {
            console.error("Erreur lors du chargement des détails du film :", error);
        }
    }
    loadMovieDetails();
} else {
    console.error("Aucun ID de film trouvé dans le localStorage.");
}
