// routes/set-current-pokemon.ts
import express, { Request, Response } from "express";
import { client } from "../database";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/set-current-pokemon", async (req: Request, res: Response) => {
    const { userId, pokemonId } = req.body;

    try {
        const usersCollection = client.db("YusRiz").collection("Users");
        const updateResult = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { currentPokemon: pokemonId } }
        );

        if (updateResult.modifiedCount > 0) {
            res.redirect(`/owned-pokemon-details/${pokemonId}`);
        } else {
            res.status(500).send("Error setting current Pokémon");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error setting current Pokémon");
    }
});

export default router;
