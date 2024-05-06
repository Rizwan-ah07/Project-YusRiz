// routes/owned-pokemon.ts
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import fetch from "node-fetch";
import { connectToDatabase } from '../database';
import { OwnedPokemon, PokemonStat, User } from "../interface";

const router = express.Router();

function isValidObjectId(id: string): boolean {
    return /^[a-fA-F0-9]{24}$/.test(id);
}

// Fetch Pokémon stats from the PokéAPI
const fetchPokemonStats = async (id: number): Promise<PokemonStat[]> => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) {
            throw new Error(`Pokémon with ID ${id} not found`);
        }
        const data = await response.json();
        return data.stats.map((stat: { stat: { name: string }, base_stat: number }) => ({
            name: stat.stat.name,
            base_stat: stat.base_stat
        }));
    } catch (err) {
        console.error(err);
        return [];
    }
};

// Ensure Pokémon stats are initialized
const ensurePokemonStats = async (pokemon: OwnedPokemon): Promise<OwnedPokemon> => {
    const stats = await fetchPokemonStats(pokemon.id);
    return {
        ...pokemon,
        stats: stats.length ? stats : pokemon.stats || []
    };
};

// Fetch Pokémon name from the PokéAPI
const fetchPokemonName = async (id: number): Promise<string> => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        if (!response.ok) {
            throw new Error(`Pokémon with ID ${id} not found`);
        }
        const data = await response.json();
        return data.name.charAt(0).toUpperCase() + data.name.slice(1);
    } catch (err) {
        console.error(err);
        return "Unknown";
    }
};

// Fetch and attach Pokémon names dynamically
const fetchAndAttachPokemonDetails = async (pokemons: OwnedPokemon[]): Promise<OwnedPokemon[]> => {
    return await Promise.all(
        pokemons.map(async (pokemon) => {
            const name = await fetchPokemonName(pokemon.id);
            const pokemonWithStats = await ensurePokemonStats(pokemon);
            return {
                ...pokemonWithStats,
                name
            };
        })
    );
};

// Fetch user's Pokémon
router.get('/owned-pokemon', async (req: Request, res: Response) => {
    try {
        const { usersCollection } = await connectToDatabase();
        const userId = req.session.userId;

        if (!userId || !isValidObjectId(userId)) {
            return res.status(400).render('error', { title: 'Error', message: 'Invalid user ID format.' });
        }

        const user = await usersCollection.findOne({ _id: new ObjectId(userId) }) as User | null;

        if (!user || !user.ownedPokemon) {
            return res.render('owned-pokemon', { title: 'Owned Pokémon', pokemons: [], currentPokemon: null });
        }

        const sortedPokemons = user.ownedPokemon.sort((a: OwnedPokemon, b: OwnedPokemon) => a.id - b.id);
        const pokemonsWithDetails = await fetchAndAttachPokemonDetails(sortedPokemons);
        const currentPokemon = user.currentPokemon
            ? pokemonsWithDetails.find((pokemon: OwnedPokemon) => pokemon.id === user.currentPokemon)
            : null;

        res.render('owned-pokemon', {
            title: 'Owned Pokémon',
            pokemons: pokemonsWithDetails,
            currentPokemon
        });
    } catch (err) {
        console.error("Owned Pokémon error:", err);
        res.status(500).render('error', { title: 'Error', message: 'Error fetching owned Pokémon.' });
    }
});

// Fetch specific Pokémon details
router.get('/owned-pokemon-details/:id', async (req: Request, res: Response) => {
    try {
        const { usersCollection } = await connectToDatabase();
        const userId = req.session.userId;

        if (!userId || !isValidObjectId(userId)) {
            return res.status(400).render('error', { title: 'Error', message: 'Invalid user ID format.' });
        }

        const pokemonId = parseInt(req.params.id, 10);

        const user = await usersCollection.findOne({ _id: new ObjectId(userId) }) as User | null;
        const pokemon = user?.ownedPokemon.find((p: OwnedPokemon) => p.id === pokemonId);

        if (!pokemon) {
            return res.status(404).render('error', { title: 'Error', message: 'Pokémon not found.' });
        }

        // Add Pokémon name dynamically
        const name = await fetchPokemonName(pokemonId);
        const pokemonWithStats = await ensurePokemonStats(pokemon);
        const pokemonWithDetails = {
            ...pokemonWithStats,
            name
        };

        res.render('owned-pokemon-details', {
            title: `Details of ${pokemonWithDetails.nickname}`,
            pokemon: pokemonWithDetails,
            userId
        });
    } catch (err) {
        console.error("Owned Pokémon details error:", err);
        res.status(500).render('error', { title: 'Error', message: 'Error fetching Pokémon details.' });
    }
});

// Route to set the current Pokémon
router.post('/set-current-pokemon', async (req: Request, res: Response) => {
    const { userId, pokemonId } = req.body;

    try {
        const { usersCollection } = await connectToDatabase();

        const updateResult = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { currentPokemon: parseInt(pokemonId, 10) } }
        );

        if (updateResult.modifiedCount > 0) {
            res.redirect(`/owned-pokemon-details/${pokemonId}`);
        } else {
            res.status(500).render('error', { title: 'Error', message: 'Error setting current Pokémon' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { title: 'Error', message: 'Error setting current Pokémon' });
    }
});

export default router;
