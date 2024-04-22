import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import axios from "axios";

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


const getPokemonDetails = async (id: number) => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return response.data;
  };

  const getGenerations = async () => {
    const response = await axios.get('https://pokeapi.co/api/v2/generation/');
    return response.data.results.map((gen: any) => gen.name);
};

const getTypes = async () => {
    const response = await axios.get('https://pokeapi.co/api/v2/type/');
    return response.data.results.map((type: any) => type.name);
};
  
  app.get("/catch", async (req, res) => {
      try {
          const pokemonPromises = [];
          for (let i = 1; i <= 30; i++) {
              pokemonPromises.push(getPokemonDetails(i));
          }
          const pokemonsDetails = await Promise.all(pokemonPromises);
          
          const pokemons = pokemonsDetails.map((pokemon) => {
              return {
                  id: pokemon.id,
                  name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1), 
                  types: pokemon.types.map((type: any) => type.type.name).join(', '),
                  image: pokemon.sprites.other['official-artwork'].front_default,
                  stats: pokemon.stats.map((stat: any) => ({
                      name: stat.stat.name,
                      base: stat.base_stat,
                  })),
                  abilities: pokemon.abilities.map((ability: any) => ability.ability.name),
              };
          });
  
          const generations = await getGenerations();
          const types = await getTypes();
  
          res.render('catch', {
              title: 'Catch Page',
              pokemons: pokemons,
              generations: generations,
              types: types,
          });
      } catch (error) {
          console.error(error);
          res.status(500).render('error', { message: 'Error fetching Pokémon data.' });
      }
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