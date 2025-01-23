import apikey from "./key.js";

const searchInput = document.querySelector("#search");
const gallery = document.querySelector(".gallery");
const loadMoreButton = document.getElementById("loadMore");

let currentPage = 1; // Page actuelle pour les films populaires
let currentSearchPage = 1; // Page actuelle pour les résultats de recherche
let searchQuery = null; // Requête en cours (null si aucune recherche)

// Fonction pour récupérer des films populaires aléatoires
async function fetchRandomMovies(page = 1) {
    try {
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apikey}&language=fr&page=${page}`;
        const res = await fetch(url);
        const { results } = await res.json();
        return results.slice(0, 10); 
    } catch (error) {
        console.error("Erreur lors du chargement des films :", error);
        return [];
    }
}

// Fonction pour rechercher des films
async function searchMovies(query, page = 1) {
    try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&language=fr&query=${encodeURIComponent(query)}&page=${page}`;
        const res = await fetch(url);
        const { results } = await res.json();
        return results; // Retourne tous les résultats pour cette page
    } catch (error) {
        console.error("Erreur lors de la recherche des films :", error);
        return [];
    }
}

// Fonction pour afficher les résultats
function displayResults(movies) {
    if (movies.length === 0 && gallery.innerHTML === "") {
        gallery.innerHTML = "<p>Aucun film trouvé.</p>";
        return;
    }

    // Ajouter les films à la galerie
    movies.forEach((movie) => {
        const movieContainer = document.createElement("div");
        movieContainer.className = "movie-container";

        const img = document.createElement("img");
        img.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
        img.className = "gallery-image";

        const description = document.createElement("p");
        description.textContent = movie.overview.slice(0, 101) + "...";
        description.className = "downSpace";

        const title = document.createElement("p");
        title.textContent = movie.title.length > 20 ? `${movie.title.slice(0, 20)}...` : movie.title;
        title.className = "movie-title";

        const moreInfoButton = document.createElement("button");
        $(moreInfoButton).addClass("blackBackground white")
        moreInfoButton.textContent = "En savoir plus";
        moreInfoButton.setAttribute("data-movie-id", movie.id);

        moreInfoButton.addEventListener("click", () => {
            const movieId = moreInfoButton.getAttribute("data-movie-id");
            localStorage.setItem("selectedMovieId", movieId);
            window.location.href = "./movie.html";
        });

        movieContainer.appendChild(img);
        movieContainer.appendChild(title);
        movieContainer.appendChild(description);
        movieContainer.appendChild(moreInfoButton);

        gallery.appendChild(movieContainer);
    });
}

// Charger plus de films
async function loadMoreMovies() {
    if (searchQuery) {
        // Charger plus de résultats de recherche
        currentSearchPage++;
        const moreSearchResults = await searchMovies(searchQuery, currentSearchPage);
        displayResults(moreSearchResults);
    } else {
        // Charger plus de films populaires
        currentPage++;
        const moreRandomMovies = await fetchRandomMovies(currentPage);
        displayResults(moreRandomMovies);
    }
}

// Gestion de la recherche
searchInput.addEventListener("input", async (e) => {
    const query = e.target.value.trim();

    if (!query) {
        // Si le champ de recherche est vide, revenir aux films aléatoires
        searchQuery = null;
        currentSearchPage = 1;
        gallery.innerHTML = ""; // Effacer les résultats précédents
        const randomMovies = await fetchRandomMovies(currentPage);
        displayResults(randomMovies);
    } else {
        // Effectuer une recherche
        searchQuery = query; // Mettre à jour la requête active
        currentSearchPage = 1;
        gallery.innerHTML = ""; // Effacer les résultats précédents
        const searchResults = await searchMovies(query, currentSearchPage);
        displayResults(searchResults);
    }
});

// Charger des films aléatoires dès que la page est prête
document.addEventListener("DOMContentLoaded", async () => {
    const randomMovies = await fetchRandomMovies(currentPage);
    displayResults(randomMovies);
});

// Ajouter un événement au bouton "Charger plus"
loadMoreButton.addEventListener("click", loadMoreMovies);
