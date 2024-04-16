import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
    res.render("index", {
        title: "Home",
        message: "Home Page"
    })
});


app.get("/login", (req, res) => {
    res.render("login", {
        title: "Login Page"
    });
});


app.get("/signup", (req, res) => {
    res.render("signup", {
        title: "Signup Page"
    });
});


app.get("/battler", (req, res) => {
    res.render("battler", {
        title: "Battler Page"
    });
});


app.get("/catch", (req, res) => {
    res.render("catch", {
        title: "Catch Page"
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