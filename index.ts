import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import fetch from 'node-fetch';
import { connectToDatabase } from './database'; 
import pokemonRoutes from "./routes/pokemon-overview"; 
import loginRoute from "./routes/login";
import signupRoute from "./routes/signup";
import { MongoClient } from "mongodb";

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
app.use("/login", loginRoute)
app.use("/signup", signupRoute)
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


app.get("/battler", (req, res) => {
    res.render("battler", {
        title: "Battler Page"
    });
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