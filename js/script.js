async function fetchPokemonData(pokemonNumber) {

    const randomPokemonId = Math.floor(Math.random() * 898) + 1;

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);
    const data = await response.json();

    const pokemonElement = document.getElementById(`pokemon${pokemonNumber}`);
    const imgElement = document.getElementById(`img${pokemonNumber}`);
    const pokemonTypes = document.getElementById(`pokitype${pokemonNumber}`);
    const pokemonAbilties = document.getElementById(`abilities${pokemonNumber}`);
    const pokemonStat = document.getElementById(`stat${pokemonNumber}`);

    pokemonElement.querySelector('h2').textContent = data.name;
    imgElement.src = data.sprites.front_default;
    pokemonTypes.querySelector('h2').textContent = data.types.map(type=> type.type.name);
    pokemonAbilties.querySelector('li').textContent = data.abilities.map(ability=> ability.ability.name);
    pokemonStat.querySelector('ul').innerHTML = data.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('');



}


fetchPokemonData(1);
fetchPokemonData(2);
fetchPokemonData(3);






function toggleMenu() {
    var nav = document.getElementById('nav');
    nav.style.display = (nav.style.display === 'block') ? 'none' : 'block';
}







let currentPokemonData; 
async function fetchRandomPokemonImage() {
    const randomPokemonId = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);
    currentPokemonData = await response.json(); 
    const imgElement = document.getElementById('img3');
    imgElement.src = currentPokemonData.sprites.front_default;
}

fetchRandomPokemonImage();

function checkPokemon() {
    const input = document.getElementById('input').value.toLowerCase();

    if (input === currentPokemonData.name.toLowerCase()) {
        document.getElementById('correctAnswers').textContent++;
        fetchRandomPokemonImage(); 
        document.getElementById('input').value = ''; 


    } else {
        document.getElementById('incorrectAnswers').textContent++;
        fetchRandomPokemonImage(); 
    }



}