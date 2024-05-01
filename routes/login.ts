import express, { Express, Request, Response } from "express";
import bcrypt from 'bcrypt';
import { client } from "../database";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("login", {
        title: "Login Page",
        error: "" // No error message initially
    });
});

router.post("/", async (req, res) => {
    const { Username, Password } = req.body;

    try {
        const user = await client.db("YusRiz").collection("Users").findOne({ username: Username });
        if (user && await bcrypt.compare(Password, user.password)) {
            res.redirect("/pokemon-overview"); // Authentication successful
        } else {
            // Render the login page again with an error message
            res.render("login", {
                title: "Login Page",
                error: "Incorrect username or password" // Provide a user-friendly error message
            });
        }
    } catch (error) {
        console.error(error);
        res.render("login", {
            title: "Login Page",
            error: "Server error" // Handle server errors separately
        });
    }
});

export default router;
