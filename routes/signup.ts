// routes/signup.ts
import express, { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { client } from "../database";
import { PokemonStat, OwnedPokemon } from "../interface";

const router = express.Router();

// Define the starter Pokémon data
const starterPokemonStats: Record<number, PokemonStat[]> = {
    1: [
        { name: 'hp', base_stat: 45 },
        { name: 'attack', base_stat: 49 },
        { name: 'defense', base_stat: 49 },
        { name: 'special-attack', base_stat: 65 },
        { name: 'special-defense', base_stat: 65 },
        { name: 'speed', base_stat: 45 }
    ],
    4: [
        { name: 'hp', base_stat: 39 },
        { name: 'attack', base_stat: 52 },
        { name: 'defense', base_stat: 43 },
        { name: 'special-attack', base_stat: 60 },
        { name: 'special-defense', base_stat: 50 },
        { name: 'speed', base_stat: 65 }
    ],
    7: [
        { name: 'hp', base_stat: 44 },
        { name: 'attack', base_stat: 48 },
        { name: 'defense', base_stat: 65 },
        { name: 'special-attack', base_stat: 50 },
        { name: 'special-defense', base_stat: 64 },
        { name: 'speed', base_stat: 43 }
    ]
};

const starterPokemon: OwnedPokemon[] = [
    {
        id: 1,
        nickname: "Bulbas",
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
        caughtAt: new Date().toISOString(),
        stats: starterPokemonStats[1]
    },
    {
        id: 4,
        nickname: "Charm",
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
        caughtAt: new Date().toISOString(),
        stats: starterPokemonStats[4]
    },
    {
        id: 7,
        nickname: "Squirt",
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
        caughtAt: new Date().toISOString(),
        stats: starterPokemonStats[7]
    }
];

router.get("/", (req, res) => {
    res.render("signup", {
        title: "Signup Page"
    });
});

router.post("/", async (req: Request, res: Response) => {
    const { Username, Password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(Password, 10);
        await client.db("YusRiz").collection("Users").insertOne({
            username: Username,
            password: hashedPassword,
            ownedPokemon: starterPokemon // Add the starter Pokémon to the new user
        });
        res.redirect("/login");
    } catch (error) {
        console.error(error);
        res.render("signup", {
            title: "Signup Page",
            error: "Error creating account"
        });
    }
});

export default router;
