import express, { Express, Request, Response } from "express";
import {client} from "../database"

const router = express.Router();

router.get("/", (req, res) => {
    res.render("signup", {
        title: "Signup Page"
    });
});

router.post("/", async (req, res) => {
    const { Username, Password} = req.body;

    try{
        await client.db("YusRiz").collection("Users").insertOne({username: Username, password: Password})
        res.redirect("/login")
    }

    catch(error){
        console.error(error);
    }
    });



export default router;