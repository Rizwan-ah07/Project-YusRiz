import express, { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { client } from "../database";

// Extend session data directly in the file
declare module 'express-session' {
    interface SessionData {
        userId: string;
    }
}

const router = express.Router();

router.get("/", (req, res) => {
    res.render("login", {
        title: "Login Page",
        error: "" 
    });
});

router.post("/", async (req: Request, res: Response) => {
    const { Username, Password } = req.body;

    try {
        const user = await client.db("YusRiz").collection("Users").findOne({ username: Username });
        if (user && await bcrypt.compare(Password, user.password)) {
            req.session.userId = user._id.toString(); 
            res.redirect("/owned-pokemon");
        } else {
            res.render("login", {
                title: "Login Page",
                error: "Incorrect username or password"
            });
        }
    } catch (error) {
        console.error(error);
        res.render("login", {
            title: "Login Page",
            error: "Server error"
        });
    }
});

export default router;
