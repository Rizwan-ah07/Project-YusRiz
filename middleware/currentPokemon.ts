// middleware/currentPokemon.ts
import { Request, Response, NextFunction } from "express";
import { client } from "../database";
import { ObjectId } from "mongodb";
import { User, OwnedPokemon } from "../interface";

export async function setCurrentPokemon(req: Request, res: Response, next: NextFunction) {
    const userId = req.session?.userId;

    if (userId) {
        try {
            const usersCollection = client.db("YusRiz").collection<User>("Users");
            const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

            res.locals.currentPokemon = user?.currentPokemon
                ? user.ownedPokemon.find((pokemon: OwnedPokemon) => pokemon.id === user.currentPokemon)
                : null;
        } catch (error) {
            console.error("Error fetching current Pokémon:", error);
            res.locals.currentPokemon = null;
        }
    } else {
        res.locals.currentPokemon = null;
    }

    next();
}
