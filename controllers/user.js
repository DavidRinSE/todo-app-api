const express = require("express");
const router = express.Router();
const db = require("../models")
const Sequelize = db.Sequelize
const Responses = require("./responses")
const bcrypt = require('bcrypt');
const saltRounds = 10

const User = db.User

router.post("/", async (req, res) => {
    const { username, password, email } = req.body;

    const userSearch = await User.findAll({where: {username}})
    if(userSearch.length === 0){
        bcrypt.hash(password, saltRounds, (err, hash) => {
            User.create({
                username: username,
                password: hash,
                email: email,
            })
                .then(user => {
                    res.json({
                        username: user.get("username"),
                        statusCode:200
                    })
                })
                .catch(error => {
                    if( error instanceof Sequelize.ValidationError){
                        let messages = error.errors.map((error) => {
                            return error.message
                        })
                        return res.status(400).send({ errors: messages, statusCode:400 })
                    }
                    console.log(error);
                    res.status(500).send();
                })
        })
    }
    else {
        res.status(400).send(Responses.AlreadyExists("username"))
    }
})

module.exports = router