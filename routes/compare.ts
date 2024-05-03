import express, { Express, Request, Response } from "express";
import fetch from "node-fetch";

const router = express.Router();

async function getPokemon(name: string) {
    const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
    const response = await fetch(url);
    return await response.json();
}

router.get("/compare", async (req: Request, res: Response) => {
    const { pokemon1, pokemon2 } = req.query;

    if (!pokemon1 || !pokemon2) {
        // Render a form for input if no parameters are provided
        res.render("compare", {
            title: "Compare Pokémon",
            form: true, // Indicate that the form should be displayed
            pokemon1: null,
            pokemon2: null
        });
    } else {
        try {
            const data1 = await getPokemon(pokemon1 as string);
            const data2 = await getPokemon(pokemon2 as string);
            res.render("compare", {
                title: "Compare Pokémon",
                form: false, // No need to display the form
                pokemon1: data1,
                pokemon2: data2
            });
        } catch (error) {
            console.error("Failed to fetch Pokémon data:", error);
            res.status(500).send("Failed to fetch data.");
        }
    }
});


async function searchPokemon(query: string) {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=1000`; // This fetches a large list of Pokémon names
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results.filter((pokemon: any) => pokemon.name.includes(query.toLowerCase()));
    } catch (error) {
        console.error("Failed to fetch Pokémon data:", error);
        throw error;
    }
}

router.get("/search-pokemon", async (req: Request, res: Response) => {
    const { q } = req.query; // "q" is the query parameter for the search term
    if (!q) {
        return res.json([]);
    }
    try {
        const matches = await searchPokemon(q as string);
        res.json(matches.map((match: any) => match.name));
    } catch (error) {
        res.status(500).json([]);
    }
});


export default router;