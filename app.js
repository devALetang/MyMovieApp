const API_KEY = 'api_key=ae58791970999f1b116924e31d690e66';
const BASE_URL ="https://api.themoviedb.org/3"
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}`;
const IMG_URL = "https://image.tmdb.org/t/p/w500/";
const searchURL = `${BASE_URL}/search/movie?${API_KEY}`;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

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

        movieE1.classList.add('movie');
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