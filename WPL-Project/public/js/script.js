// zijbalk nav mobile view
const toggleSidebar = () => {
    const sidebar = document.querySelector('.navigation');
    const content = document.querySelector('.mainMain');
    const sidebarToggleBtn = document.querySelector('.sidebar-toggle');
    sidebar.classList.toggle('active');
    content.classList.toggle('active');
    sidebarToggleBtn.classList.toggle('active');
};

document.addEventListener('DOMContentLoaded', () => {
    const sidebarToggleBtn = document.querySelector('.sidebar-toggle');
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', toggleSidebar);
    }
});

//copyright
document.addEventListener('DOMContentLoaded', function() {
    var currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
});

//popup
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.catchPopupBtn').addEventListener('click', function() {
        // Toggle the visibility of additional information
        var catchPopup = document.querySelector('.catchPopup');
        catchPopup.style.display = (catchPopup.style.display === 'none') ? 'block' : 'none';
    });

    document.querySelector('.closeBtn').addEventListener('click', function() {
        // Close the popup when close button is clicked
        var catchPopup = document.querySelector('.catchPopup');
        catchPopup.style.display = 'none';
    });
});

//popup
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.ownPopupBtn').addEventListener('click', function() {
        // Toggle the visibility of additional information
        var catchPopup = document.querySelector('.ownPopup');
        catchPopup.style.display = (catchPopup.style.display === 'none') ? 'block' : 'none';
    });

    document.querySelector('.ownCloseBtn').addEventListener('click', function() {
        // Close the popup when close button is clicked
        var catchPopup = document.querySelector('.ownPopup');
        catchPopup.style.display = 'none';
    });
});

// pokemon informatie
document.addEventListener('DOMContentLoaded', function() {
    const pokemonData = {
        pikachu: {
            imgSrc: "assets/pikachu.png",
            type: "Electric",
            ability: "Static",
            stats: {
                hp: "35",
                attack: "55",
                defense: "40",
                spAtk: "50",
                spDef: "50",
                speed: "90"
            }
        },
        squirtle: {
            imgSrc: "assets/squirtle.png",
            type: "Water",
            ability: "Torrent",
            stats: {
                hp: "44",
                attack: "48",
                defense: "65",
                spAtk: "50",
                spDef: "64",
                speed: "43"
            }
        },
        charmander: {
            imgSrc: "assets/charmander.png",
            type: "Fire",
            ability: "Blaze",
            stats: {
                hp: "39",
                attack: "52",
                defense: "43",
                spAtk: "60",
                spDef: "50",
                speed: "65"
            }
        }
    };
// select and compare pokemon
    function updatePokemonInfo(selectId, imageId, infoId) {
        const selectedValue = document.getElementById(selectId).value;
        const pokemon = pokemonData[selectedValue];

        if (pokemon) {
            document.getElementById(imageId).src = pokemon.imgSrc;
            const infoArea = document.getElementById(infoId);
            infoArea.innerHTML = `
                <div class="compareInfoDiv">
                    <h2 class="silverUnderline">Type</h2>
                    <p class="silverUnderlineInfo">${pokemon.type}</p>
                    <h2 class="silverUnderline">Ability</h2>
                    <p class="silverUnderlineInfo">${pokemon.ability}</p>
                </div>
                <h2 class="silverUnderline">Stats</h2>
                <ul class="stats-list silverUnderlineInfo" id="${infoId}Stats">
                    ${Object.entries(pokemon.stats).map(([key, value]) => `
                    <li>${key.toUpperCase()}: <span class="stat-value" data-stat-type="${key}">${value}</span></li>
                    `).join('')}
                </ul>
            `;
        } else {
            document.getElementById(imageId).src = '';
            document.getElementById(infoId).innerHTML = '';
        }
    }

    // stats
    function comparePokemonStats() {
        const leftPokemon = pokemonData[document.getElementById('pokemonSelectLeft').value];
        const rightPokemon = pokemonData[document.getElementById('pokemonSelectRight').value];

        if (!leftPokemon || !rightPokemon) {
            return;
        }

        const leftStatsElements = document.querySelectorAll('#pokemonInfoLeft .stat-value');
        const rightStatsElements = document.querySelectorAll('#pokemonInfoRight .stat-value');

        leftStatsElements.forEach((leftElement, index) => {
            const statType = leftElement.dataset.statType;
            const leftStatValue = parseInt(leftElement.textContent, 10);
            const rightStatValue = parseInt(rightStatsElements[index].textContent, 10);

            leftElement.parentElement.className = '';
            rightStatsElements[index].parentElement.className = '';

            if (leftStatValue > rightStatValue) {
                leftElement.parentElement.classList.add('higherStat');
                rightStatsElements[index].parentElement.classList.add('lowerStat');
            } else if (leftStatValue < rightStatValue) {
                leftElement.parentElement.classList.add('lowerStat');
                rightStatsElements[index].parentElement.classList.add('higherStat');
            }
        });
    }

    const leftSelect = document.getElementById('pokemonSelectLeft');
    const rightSelect = document.getElementById('pokemonSelectRight');

    leftSelect.addEventListener('change', () => {
        updatePokemonInfo('pokemonSelectLeft', 'selectedPokemonLeft', 'pokemonInfoLeft');
        comparePokemonStats(); 
    });

    rightSelect.addEventListener('change', () => {
        updatePokemonInfo('pokemonSelectRight', 'selectedPokemonRight', 'pokemonInfoRight');
        comparePokemonStats(); 
    });
});

// Fight dropdown menu
document.addEventListener('DOMContentLoaded', function() {
    const pokemonData = {
        charmander: {
            imgSrc: "assets/charmander.png",
            hp: "39HP"
        },
        squirtle: {
            imgSrc: "assets/squirtle.png",
            hp: "44HP"
        },
        dialga: {
            imgSrc: "assets/Dialga.png",
            hp: "100HP"
        },
        giratina: {
            imgSrc: "assets/Giratina.png",
            hp: "150HP"
        }
    };


    function updateBattleInfo(selectElement, imageElement, hpElement) {
        const selectedValue = selectElement.value;
        const pokemon = pokemonData[selectedValue.toLowerCase()]; 

        if (pokemon) {
            imageElement.src = pokemon.imgSrc;
            hpElement.textContent = pokemon.hp;
        }
        else {
            imageElement.src = "";
            hpElement.textContent = "";
        }
    }
 
    const selectLeft = document.querySelector('.leftSectionBattle .selectFormBattle select');
    const imageLeft = document.querySelector('.leftSectionBattle .battleImage img');
    const hpLeft = document.querySelector('.leftSectionBattle .battleHpLevel');

    const selectRight = document.querySelector('.rightSectionBattle .selectFormBattle select');
    const imageRight = document.querySelector('.rightSectionBattle .battleImage img');
    const hpRight = document.querySelector('.rightSectionBattle .battleHpLevel');


    selectLeft.addEventListener('change', () => updateBattleInfo(selectLeft, imageLeft, hpLeft));
    selectRight.addEventListener('change', () => updateBattleInfo(selectRight, imageRight, hpRight));
});


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
    fetch('/catch?page=' + currentPage)
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


