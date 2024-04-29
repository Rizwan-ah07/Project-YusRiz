const compareButton = document.querySelector('.compareButton');
    compareButton.addEventListener('click', () => {
        window.location.href = '/compare?pokemonId=<%= pokemon.id %>';
    });
