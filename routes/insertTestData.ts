// insertTestData.ts
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from 'bcrypt';

const uri = "mongodb+srv://s151398:Rizwan@wpl-project.1v5hog1.mongodb.net/";
const client = new MongoClient(uri);

async function insertTestData() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas!");

        const db = client.db('YusRiz');
        const usersCollection = db.collection('Users');

        // Create test user data
        const hashedPassword = await bcrypt.hash('password', 10);
        const testUser = {
            _id: new ObjectId("6449cde2d91f4a1a4a003ebb"),
            username: "testuser",
            password: hashedPassword,
            ownedPokemon: [
                {
                    id: 25,
                    nickname: "Sparky",
                    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
                    caughtAt: "2023-05-05T10:00:00Z"
                },
                {
                    id: 1,
                    nickname: "Bulby",
                    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
                    caughtAt: "2023-05-05T10:00:00Z"
                }
            ]
        };

        // Insert or update test data
        await usersCollection.updateOne(
            { _id: new ObjectId("6449cde2d91f4a1a4a003ebb") },
            { $set: testUser },
            { upsert: true }
        );

        console.log("Test data inserted successfully!");
    } catch (err) {
        console.error("Error inserting test data:", err);
    } finally {
        await client.close();
    }
}

insertTestData();
