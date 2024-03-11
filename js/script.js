async function fetchPokemonData(pokemonNumber) {

    const randomPokemonId = Math.floor(Math.random() * 898) + 1;

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);
    const data = await response.json();

    const pokemonElement = document.getElementById(`pokemon${pokemonNumber}`);
    const imgElement = document.getElementById(`img${pokemonNumber}`);
    const pokemonTypes = document.getElementById(`pokitype${pokemonNumber}`);
    const pokemonAbilties = document.getElementById(`abilities${pokemonNumber}`);

    pokemonElement.querySelector('h2').textContent = data.name;
    imgElement.src = data.sprites.front_default;
    pokemonTypes.querySelector('h2').textContent = data.types.map(type=> type.type.name);
    pokemonAbilties.querySelector('li').textContent = data.abilities.map(ability=> ability.ability.name);



}


fetchPokemonData(1);
fetchPokemonData(2);