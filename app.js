// On déclare les constantes contenant l'URL de l'API, l'URL de l'image, l'URL de recherche, ainsi que les éléments HTML que l'on va manipuler.
const API_KEY = 'api_key=ae58791970999f1b116924e31d690e66';
const BASE_URL ="https://api.themoviedb.org/3"
const API_URL = `${BASE_URL}/discover/movie?${API_KEY}`;
const IMG_URL = "https://image.tmdb.org/t/p/w500/";
const searchURL = `${BASE_URL}/search/movie?${API_KEY}`;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

// On récupère les films à partir de l'API en utilisant fetch et on met à jour la liste des films à afficher en utilisant la fonction showMovies.
getMovies(API_URL)

function getMovies(url) {

    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        showMovies(data.results)
    });
}

function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {

        const {title, poster_path, vote_average} = movie;
        const movieE1 = document.createElement('div');

        movieE1.setAttribute('data-id', movie.id);
        movieE1.classList.add('movie');
        movieE1.addEventListener('click', () => showMovieDetails(movie.id));
        movieE1.innerHTML = `
            <img src="${IMG_URL+poster_path}" alt="${title}">

            <div class="movie_info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${Math.floor(vote_average)}</span>
            </div>
    
        `
        
        main.appendChild(movieE1);
    });
}

// On retourne la couleur associée à la note moyenne pour chaque film.
function getColor(vote) {
    if(vote>=8){
        return 'green'
    }else if(vote>=5){
        return 'orange'
    }else
        return 'red'
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if(searchTerm) {
        getMovies(searchURL+'&query='+searchTerm)
    }else
        getMovies(API_URL)
})

function showMovieDetails(id) {
    // Créer l'URL de l'API pour récupérer les informations du film
    const movieDetailsURL = `${BASE_URL}/movie/${id}?${API_KEY}&append_to_response=credits,videos`;

    // Récupérer les informations du film depuis l'API
    fetch(movieDetailsURL)
        .then(res => res.json())
        .then(movie => {
            // Créer une div pour afficher les informations du film
            const modalContent = document.createElement('div');
            modalContent.innerHTML = `
            <section>
                <img src="${IMG_URL+movie.poster_path}" alt="${movie.title}">
            </section>
            <section>
                <h2 class='mdtitre'>${movie.title}</h2>
                <p>${movie.overview}</p>
                <p>Release date: ${movie.release_date}</p>
                <p>Rating: ${movie.vote_average}</p>
                <p>Director: ${getDirector(movie.credits)}</p>
                <p>Writer: ${getWriter(movie.credits)}</p>
                <p>Cast: ${getCast(movie.credits)}</p>
                <section class="video-container">
                    <iframe width="560" height="315" src="${getTrailerUrl(movie.videos.results)}" frameborder="0" allowfullscreen></iframe>
                </section>
            </section>
            
            `;

            // Créer la modal et ajouter la div du contenu à l'intérieur
            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.appendChild(modalContent);

            // Ajouter la modal à la page
            document.body.appendChild(modal);

            // Ajouter un écouteur d'événement click au bouton de fermeture de la modal
            const closeButton = document.createElement('button');
            closeButton.innerText = 'X';
            closeButton.addEventListener('click', () => {
                modal.remove();
            });
            modalContent.appendChild(closeButton);
        })
        .catch(err => console.error(err));
}


// Fonction pour récupérer l'URL de la bande-annonce
function getTrailerUrl(videos) {
    const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    if (trailer) {
        return `https://www.youtube.com/embed/${trailer.key}`;
    }
    return '';
}


// Fonction pour récupérer le nom du réalisateur
function getDirector(credits) {
    const director = credits.crew.find(member => member.job === 'Director');
    if (director) {
        return director.name;
    }
    return 'N/A';
}

// Fonction pour récupérer le nom du scénariste
function getWriter(credits) {
    const writer = credits.crew.find(member => member.department === 'Writing');
    if (writer) {
        return writer.name;
    }
    return 'N/A';
}

// Fonction pour récupérer les noms des acteurs
function getCast(credits) {
    const cast = credits.cast.slice(0, 5).map(member => member.name);
    return cast.join(', ');
}
