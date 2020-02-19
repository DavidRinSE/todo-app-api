const express = require("express");
const router = express.Router();
const db = require("../models")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = db.User

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send({message:"Request body missing username or password", statusCode:400})
    }
    let user = await User.findOne({where: {username}})
    if (!user){
        return res.status(404).send({message:"No user with that username found", statusCode:404})
    } else {
        bcrypt.compare(password, user.password, (err, result) => {
            if (result){
                const payload = { username: user.get("username") };
                const token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: "24h"
                });
                return res.send({
                    token,
                    username: user.get("username"),
                    statusCode: res.statusCode
                });
            } else {
                res.status(400).send({message:"Incorrect password", statusCode:401})
            }
        })
    }
})

router.post("/logout", (req, res) => {
    res.json({
        message: "/api/auth/logout post"
    })
})

module.exports = router