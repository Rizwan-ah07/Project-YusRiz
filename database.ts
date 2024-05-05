// database.ts
import { MongoClient, Db, Collection } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://s151398:Rizwan@wpl-project.1v5hog1.mongodb.net/";
export const client = new MongoClient(uri);

export async function connectToDatabase(): Promise<{ db: Db, usersCollection: Collection }> {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas!");

        const db = client.db('YusRiz');
        const usersCollection = db.collection('Users');

        return { db, usersCollection };
    } catch (err) {
        console.error("Failed to connect to MongoDB Atlas:", err);
        throw err;
    }
}
