import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import axios from "axios";

dotenv.config();

const app: Express = express();

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

// pokemon id
const getPokemonDetails = async (id: number) => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return response.data;
};

// get pokemon generations
const getGenerations = async () => {
    const response = await axios.get('https://pokeapi.co/api/v2/generation/');
    return response.data.results.map((gen: any) => gen.name);
};

//get pokemon types
const getTypes = async () => {
    const response = await axios.get('https://pokeapi.co/api/v2/type/');
    return response.data.results.map((type: any) => type.name);
};

// catch pokemon
app.get("/catch", async (req, res) => {
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
            types: pokemon.types.map((type: any) => type.type.name).join(', '),
            image: pokemon.sprites.other['official-artwork'].front_default,
            stats: pokemon.stats.map((stat: any) => ({
                name: stat.stat.name,
                base: stat.base_stat,
            })),
            abilities: pokemon.abilities.map((ability: any) => ability.ability.name),
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

// card detail pagina

const getPokemonSpecies = async (id: number) => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    return response.data;
};

const getEvolutionChain = async (url: string) => {
    const response = await axios.get(url);
    return response.data;
};

const getPokemonEvolution = async (id: number) => {
    const pokemonData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const speciesData = await getPokemonSpecies(id);
    const evolutionData = await getEvolutionChain(speciesData.evolution_chain.url);

    const pokemon = pokemonData.data;
    const officialArtworkUrl = pokemon.sprites.other['official-artwork'].front_default;

    return {
        pokemon: pokemon,
        evolution: evolutionData,
        officialArtworkUrl: officialArtworkUrl
    };
};

app.get("/pokemon/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const { pokemon, evolution } = await getPokemonEvolution(id);
        res.render('carddetails', {  // Update this line to use the correct file name
            pokemon: pokemon,
            evolution_chain: evolution.chain // Ensure this data structure matches what you expect to render
        });
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