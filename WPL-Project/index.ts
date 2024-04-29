import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import fetch from 'node-fetch';
import { connectToDatabase } from './database'; 
import pokemonRoutes from "./routes/pokemon-overview"; // Ensure path is correct

dotenv.config();

// Express
const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use("/", pokemonRoutes);
app.set("port", process.env.PORT || 3000);

// Database // MongoDB

async function main() {
    try {
        await connectToDatabase();
        console.log("Connected to MongoDB Atlas from index.ts!");

        // Perform your database operations here (if needed in index.ts)
    } catch (error) {
        console.error(error);
    }
}

main();

// Routes

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