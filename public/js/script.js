// Hamburger menu

document.addEventListener('DOMContentLoaded', function () {
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', function () {
        // Check if the menu is open
        if (navMenu.style.width == '350px') {
            navMenu.style.width = '0';
        } else {
            navMenu.style.width = '350px';
        }
    });
});

// pokemon-overview

const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
};

function applyTypeBackgrounds() {
    const cards = document.querySelectorAll('.pokemonCard[data-types]');

    cards.forEach(card => {
        const types = card.getAttribute('data-types').toLowerCase().split(',');
        const colors = types.map(type => typeColors[type.trim()]);

        if (colors.length === 1) {
            card.style.background = colors[0];
        } else {
            card.style.background = `linear-gradient(to bottom, ${colors[0]} 0%, ${colors[1]} 100%)`;
        }
    });
}

applyTypeBackgrounds();

var currentPage = 1;
function loadMore() {
    currentPage++;
    fetch('/pokemon-overview?page=' + currentPage)
        .then(response => response.text())
        .then(html => {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            var pokemonCards = tempDiv.querySelectorAll('.pokemonCard');
            if (pokemonCards.length) {
                pokemonCards.forEach(card => {
                    document.querySelector('.pokemonContainer').appendChild(card);
                    applyTypeBackgrounds();
                });
            } else {
                document.getElementById('loadMore').style.display = 'none';
            }
        })
        .catch(err => console.error('Error loading more Pokémon:', err));
}

// Guess Pokemon

document.getElementById('guess-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const response = await fetch('/guess/guess', {
        method: 'POST',
        body: new URLSearchParams(data)
    });
    const result = await response.json();
    document.getElementById('message').textContent = result.message;
    revealPokemonAfterDelay(result.nextPokemon, result.score);
    clearAutocomplete();
});

document.getElementById('skip-button').addEventListener('click', async () => {
    const response = await fetch('/guess/skip', { method: 'POST' });
    const result = await response.json();
    document.getElementById('message').textContent = result.message;
    revealPokemonAfterDelay(result.nextPokemon, result.score);
    clearAutocomplete();
});

function revealPokemonAfterDelay(pokemon, score) {
    const silhouetteImage = document.getElementById('pokemon-silhouette');

    // Reveal Pokémon name after 1 second
    setTimeout(() => {
        document.querySelector('input[name="correctName"]').value = pokemon.correctName;
        silhouetteImage.classList.add('revealed');
    }, 10);

    // Switch to the next Pokémon after 3 seconds
    setTimeout(() => {
        updatePokemon(pokemon);
        updateScoreboard(score);
    }, 3000);
}

function updatePokemon(pokemon) {
    const silhouetteImage = document.getElementById('pokemon-silhouette');
    silhouetteImage.src = pokemon.silhouetteImage;
    silhouetteImage.classList.remove('revealed'); 
    document.querySelector('input[name="correctName"]').value = pokemon.correctName;
    document.getElementById('guess').value = '';
    clearAutocomplete();
}

function updateScoreboard(score) {
    document.getElementById('scoreboard').textContent = `Correct: ${score.correct} | Incorrect: ${score.incorrect}`;
}

document.getElementById('guess').addEventListener('input', async function () {
    const value = this.value.toLowerCase();
    const response = await fetch(`/guess/search-pokemon?q=${value}`);
    const suggestions = await response.json();
    showSuggestions(suggestions, this);
});

function showSuggestions(suggestions, input) {
    const list = document.getElementById('autocomplete-list');
    list.innerHTML = '';

    if (suggestions.length > 0) {
        suggestions.forEach(name => {
            const item = document.createElement('li');
            item.textContent = name;
            item.className = 'autocomplete-item';
            item.addEventListener('click', () => {
                input.value = name;
                clearAutocomplete();
            });
            list.appendChild(item);
        });
        list.style.display = 'block';
    } else {
        list.style.display = 'none';
    }
}

function clearAutocomplete() {
    const list = document.getElementById('autocomplete-list');
    list.innerHTML = '';
    list.style.display = 'none';
}