import express, { Express, Request, Response } from "express";
import fetch from 'node-fetch';
import { PokemonDetails, Generation, Type, EvolutionDetails, EvolutionChain } from "../interface";

const router = express.Router();

// pokemon detail for overview page

const getPokemonDetails = async (id: number): Promise<PokemonDetails> => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const pokemonDetails: PokemonDetails = {
        ...data,
        image: data.sprites.other['official-artwork'].front_default
    };
    return pokemonDetails;
};

// fetches generations from pokeapi

const getGenerations = async (): Promise<string[]> => {
    const response = await fetch('https://pokeapi.co/api/v2/generation/');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as Generation;
    return data.results.map(gen => gen.name);
};

// type for overview page and detail page

const getTypes = async (): Promise<string[]> => {
    const response = await fetch('https://pokeapi.co/api/v2/type/');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as Type;
    return data.results.map(type => type.name);
};

// for detail page

const getPokemonSpecies = async (id: number) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// evolutions for evolution path in details page

const fetchAllEvolutions = async (evolutionStage: EvolutionDetails[]): Promise<PokemonDetails[]> => {
    let evolutions: PokemonDetails[] = [];
    for (const evo of evolutionStage) {
        const speciesId = parseInt(evo.species.url.split('/').slice(-2)[0]);
        const pokemonDetails: PokemonDetails = await getPokemonDetails(speciesId);
        evolutions.push({
            ...pokemonDetails,
            image: pokemonDetails.sprites.other['official-artwork'].front_default
        });
        if (evo.evolves_to.length > 0) {
            const furtherEvolutions: PokemonDetails[] = await fetchAllEvolutions(evo.evolves_to);
            evolutions = evolutions.concat(furtherEvolutions);
        }
    }
    return evolutions;
};

const getPokemonDetailsAndEvolutions = async (id: number): Promise<{ pokemon: PokemonDetails; evolutionChain: PokemonDetails[] }> => {
    const species = await getPokemonSpecies(id);
    const evolutionChainResponse: EvolutionChain = await getEvolutionChain(species.evolution_chain.url);
    const evolutionChain: PokemonDetails[] = await fetchAllEvolutions([evolutionChainResponse.chain]);
    const pokemon: PokemonDetails = await getPokemonDetails(id);
    return { pokemon, evolutionChain };
};
// Pokemon details
router.get("/pokemon/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const details = await getPokemonDetailsAndEvolutions(parseInt(id));
        res.render("pokemon-details", {
            title: `Details of ${details.pokemon.name}`,
            pokemon: details.pokemon,
            evolutionChain: details.evolutionChain
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Failed to fetch Pokémon details.' });
    }
});

const getEvolutionChain = async (url: string): Promise<EvolutionChain> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as EvolutionChain;
};
// Pokemon overview

router.get("/pokemon-overview", async (req: Request, res: Response) => {
    const limit = 30;
    const page = parseInt(req.query.page as string) || 1;
    const offset = (page - 1) * limit;



    try {
        const pokemonPromises: Promise<PokemonDetails>[] = [];

        // loop to get all pokemon based on their id
        for (let i = offset + 1; i <= offset + limit; i++) {
            pokemonPromises.push(getPokemonDetails(i));
        }
        const pokemonsDetails = await Promise.all(pokemonPromises);


        // Get the pokemon details and show it on the page

        const pokemons = pokemonsDetails.map(pokemon => ({
            id: pokemon.id,
            name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
            types: pokemon.types.map(type => type.type.name).join(', '),
            image: pokemon.sprites.other['official-artwork'].front_default,
            stats: pokemon.stats.map(stat => ({
                name: stat.stat.name,
                base: stat.base_stat,
            })),
            abilities: pokemon.abilities.map(ability => ability.ability.name),
        }));

        const generations = await getGenerations();
        const types = await getTypes();

        // Check if any Pokémon were returned; if none, send a no content status.


        if (pokemons.length === 0) {
            res.status(204).send();
        } else {
            res.render('pokemon-overview', {
                title: 'Pokemon-overview Page',
                pokemons: pokemons,
                generations: generations,
                types: types,
                nextPage: page + 1
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Error fetching Pokémon data.' });
    }
});

export default router;