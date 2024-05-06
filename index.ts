import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import session from 'express-session';
import { connectToDatabase } from './database';
import pokemonRoutes from "./routes/pokemon-overview";
import loginRoute from "./routes/login";
import signupRoute from "./routes/signup";
import compareRoute from "./routes/compare";
import guessRoute from "./routes/guess";
import ownedPokemonRoute from './routes/owned-pokemon';
import setCurrentPokemonRoute from "./routes/set-current-pokemon";
import { setCurrentPokemon } from "./middleware/currentPokemon";

dotenv.config();

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(setCurrentPokemon);

app.use("/", pokemonRoutes);
app.use("/login", loginRoute);
app.use("/signup", signupRoute);
app.use("/", compareRoute);
app.use("/guess", guessRoute);
app.use("/", ownedPokemonRoute);
app.use("/", setCurrentPokemonRoute);
app.set("port", process.env.PORT || 3000);

async function main() {
    try {
        await connectToDatabase();
        console.log("Connected to MongoDB Atlas from index.ts!");
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
    });
});

app.get("/battler", (req, res) => {
    res.render("battler", {
        title: "Battler Page"
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
