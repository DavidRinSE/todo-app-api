const express = require("express");
const router = express.Router();
const db = require("../models")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Responses = require("./responses");

const User = db.User

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send(JSON.stringify(Responses.BadRequest("username or password", "string")))
    }
    let user = await User.findOne({where: {username}})
    if (!user){
        //bad username
        return res.status(404).send(JSON.stringify(Responses.NotFound("user")))
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
                res.status(400).send("Incorrect password")
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