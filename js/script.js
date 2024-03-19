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
