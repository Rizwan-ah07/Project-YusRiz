
import express, { Request, Response } from "express";
import fetch from "node-fetch";

const router = express.Router();

// Extend the session type directly within the file
declare module "express-session" {
    interface Session {
        pokemonToCompare?: string;
    }
}

async function getPokemon(name: string) {
    const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error fetching data for ${name}`);
    return await response.json();
}

router.get("/compare", async (req: Request, res: Response) => {
    // Retrieve the Pokémon from the session or query parameters
    const pokemon1 = (req.query.pokemon1 as string) || req.session.pokemonToCompare;
    const pokemon2 = req.query.pokemon2 as string | undefined;

    if (!pokemon1) {
        // No Pokémon1 specified - show input form
        return res.render("compare", {
            title: "Compare Pokémon",
            form: true,
            pokemon1: null,
            pokemon2: null
        });
    }

    if (!pokemon2) {
        // Only Pokémon1 specified - show form for Pokémon2
        return res.render("compare", {
            title: "Compare Pokémon",
            form: true,
            pokemon1,
            pokemon2: null
        });
    }

    try {
        const data1 = await getPokemon(pokemon1);
        const data2 = await getPokemon(pokemon2);

        // Calculate differences in stats
        const statsDiff = data1.stats.map(
            (stat: { stat: { name: string }; base_stat: number }, index: number) => {
                return {
                    name: stat.stat.name,
                    diff: stat.base_stat - data2.stats[index].base_stat
                };
            }
        );

        res.render("compare", {
            title: "Compare Pokémon",
            form: false,
            pokemon1: data1,
            pokemon2: data2,
            statsDiff
        });
    } catch (error) {
        console.error("Failed to fetch Pokémon data:", error);
        res.status(500).send("Failed to fetch data.");
    }
});

router.get("/search-pokemon", async (req: Request, res: Response) => {
    const q = req.query.q as string;
    if (!q) return res.json([]);
    try {
        const url = `https://pokeapi.co/api/v2/pokemon?limit=1000`;
        const response = await fetch(url);
        const data = await response.json();
        const matches = data.results.filter((pokemon: { name: string }) =>
            pokemon.name.includes(q.toLowerCase())
        );
        res.json(matches.map((match: { name: string }) => match.name));
    } catch (error) {
        console.error("Failed to fetch Pokémon data:", error);
        res.status(500).json([]);
    }
});

// Route to set Pokémon to compare
router.get("/set-pokemon-to-compare", (req: Request, res: Response) => {
    const pokemonId = req.query.pokemon as string;
    req.session.pokemonToCompare = pokemonId;
    res.redirect(`/compare`);
});

export default router;