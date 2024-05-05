import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

// Extend the session type directly in this file
declare module 'express-session' {
    interface SessionData {
        currentPokemonId?: number;
        score?: {
            correct: number;
            incorrect: number;
        };
    }
}

const router = Router();

// Fetch a Pokémon's data by ID
const getPokemonDataById = async (pokemonId: number) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    return await response.json();
};

// Fetch Pokémon that match the search query
const searchPokemon = async (query: string) => {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const data = await response.json();
    return data.results.filter((pokemon: any) => pokemon.name.includes(query.toLowerCase()));
};

// Ensure that currentPokemonId and score are set in the session
const ensureSessionData = (req: Request) => {
    if (!req.session) {
        throw new Error('Session not initialized');
    }

    if (typeof req.session.currentPokemonId === 'undefined') {
        req.session.currentPokemonId = Math.floor(Math.random() * 151) + 1;
    }

    if (!req.session.score) {
        req.session.score = {
            correct: 0,
            incorrect: 0
        };
    }
};

router.get('/', async (req: Request, res: Response) => {
    try {
        // Reset the score upon loading the page
        req.session.score = {
            correct: 0,
            incorrect: 0
        };

        ensureSessionData(req);
        const currentPokemonId = req.session.currentPokemonId!;
        const pokemonData = await getPokemonDataById(currentPokemonId);

        res.render('guess', {
            title: 'Guess the Pokémon!',
            pokemonId: currentPokemonId,
            silhouetteImage: pokemonData.sprites.other['official-artwork'].front_default,
            correctName: pokemonData.name,
            score: req.session.score
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Session not initialized');
    }
});

router.get('/search-pokemon', async (req: Request, res: Response) => {
    const { q } = req.query;
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

router.post('/guess', async (req: Request, res: Response) => {
    try {
        ensureSessionData(req);
        const { guess } = req.body;
        const currentPokemonId = req.session.currentPokemonId!;
        const currentPokemonData = await getPokemonDataById(currentPokemonId);

        let message = 'Wrong guess!';
        let correct = false;

        if (guess.toLowerCase() === currentPokemonData.name.toLowerCase()) {
            message = 'Correct!';
            correct = true;
            req.session.score!.correct++;
        } else {
            req.session.score!.incorrect++;
        }

        // Prepare for the next Pokémon
        const nextPokemonId = Math.floor(Math.random() * 386) + 1;
        const nextPokemonData = await getPokemonDataById(nextPokemonId);
        req.session.currentPokemonId = nextPokemonId;

        res.json({
            message,
            correct,
            score: req.session.score,
            nextPokemon: {
                silhouetteImage: nextPokemonData.sprites.other['official-artwork'].front_default,
                correctName: nextPokemonData.name
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Session not initialized' });
    }
});

router.post('/skip', async (req: Request, res: Response) => {
    try {
        ensureSessionData(req);
        req.session.score!.incorrect++;

        const nextPokemonId = Math.floor(Math.random() * 151) + 1;
        const nextPokemonData = await getPokemonDataById(nextPokemonId);
        req.session.currentPokemonId = nextPokemonId;

        res.json({
            message: 'Skipped!',
            score: req.session.score,
            nextPokemon: {
                silhouetteImage: nextPokemonData.sprites.other['official-artwork'].front_default,
                correctName: nextPokemonData.name
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Session not initialized' });
    }
});

export default router;
