import express, { Express, Request, Response } from "express";


const router = express.Router();

router.get("/", (req, res) => {
    res.render("login", {
        title: "Login Page"
    });
});

router.post("/", (req, res) => {
    res.redirect("/pokemon-overview")
});


export default router;