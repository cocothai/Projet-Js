import apikey from "./key.js";

let currentPage = 1;

// Fonction pour récupérer les films d'une page donnée
async function fetchMovies(page) {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apikey}&language=fr-FR&page=${page}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Erreur lors du chargement des films :", error);
    }
}
function displayMovies(movies) {
    const gallery = document.querySelector(".gallery");

    movies.forEach((movie) => {
        if (movie.poster_path) {
            const movieContainer = document.createElement("div");
            movieContainer.className = "movie-container";

            const img = document.createElement("img");
            img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            img.className = "gallery-image";

            const title = document.createElement("h3");
            title.textContent = movie.title.length > 20 ? `${movie.title.slice(0, 20)}...` : movie.title;

            const description = document.createElement("p");
            description.textContent = movie.overview.slice(0, 101) + "...";
            $(description).addClass("downSpace");

            const plus = document.createElement("button");
            $(plus).addClass("blackBackground white");
            plus.textContent = "En savoir plus";
            plus.addEventListener("click", () => {
                localStorage.setItem("selectedMovieId", movie.id);
                window.location.href = "./movie.html";
            });

            movieContainer.appendChild(img);
            movieContainer.appendChild(title);
            movieContainer.appendChild(description);
            movieContainer.appendChild(plus);

            gallery.appendChild(movieContainer);
        }
    });
}
async function loadMovies() {
    const movies = await fetchMovies(currentPage);
    displayMovies(movies.slice(0, 10));
}
async function loadMoreMovies() {
    console.log("bouton appuyyé")
    currentPage++;
    const movies = await fetchMovies(currentPage);
    displayMovies(movies.slice(0, 10));
}

// Lancer le chargement initial
loadMovies();

// Ajouter l'écouteur pour le bouton "Charger plus"
document.getElementById("loadMore").addEventListener("click", loadMoreMovies);

