import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import fetch from 'node-fetch';
import { Pokemon, Generation, Type, EvolutionDetails, EvolutionChain, PokemonDetails } from "./interface";
dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
    res.render("index", {
        title: "Home",
        message: "Home Page"
    })
});


app.get("/login", (req, res) => {
    res.render("login", {
        title: "Login Page"
    });
});


app.get("/signup", (req, res) => {
    res.render("signup", {
        title: "Signup Page"
    });
});


app.get("/battler", (req, res) => {
    res.render("battler", {
        title: "Battler Page"
    });
});


const getPokemonDetails = async (id: number): Promise<PokemonDetails> => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Construct and return a PokemonDetails object
    const pokemonDetails: PokemonDetails = {
        ...data,
        image: data.sprites.other['official-artwork'].front_default // Use the official artwork image
    };
    return pokemonDetails;
};

const getGenerations = async (): Promise<string[]> => {
    const response = await fetch('https://pokeapi.co/api/v2/generation/');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as Generation;
    return data.results.map(gen => gen.name);
};

const getTypes = async (): Promise<string[]> => {
    const response = await fetch('https://pokeapi.co/api/v2/type/');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as Type;
    return data.results.map(type => type.name);
};

const getPokemonSpecies = async (id: number) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

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
app.get("/pokemon/:id", async (req, res) => {
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

app.get("/catch", async (req: Request, res: Response) => {
    const limit = 30;
    const page = parseInt(req.query.page as string) || 1;
    const offset = (page - 1) * limit;



    try {
        const pokemonPromises = [];
        for (let i = offset + 1; i <= offset + limit; i++) {
            pokemonPromises.push(getPokemonDetails(i));
        }
        const pokemonsDetails = await Promise.all(pokemonPromises);

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

        if (pokemons.length === 0) {
            res.status(204).send();
        } else {
            res.render('catch', {
                title: 'Catch Page',
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


app.get("/compare", (req, res) => {
    res.render("compare", {
        title: "Compare Page"
    });
});


app.get("/guess", (req, res) => {
    res.render("guess", {
        title: "Guess Page"
    });
});


app.get("/notavailable", (req, res) => {
    res.render("notavailable", {
        title: "Not Available"
    });
});


app.get("/ownpokemon", (req, res) => {
    res.render("ownpokemon", {
        title: "Own Pokémon Page"
    });
});

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});