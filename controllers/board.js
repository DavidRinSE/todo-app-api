const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../models");
const Responses = require("./responses");

const Board = db.Board
const User = db.User
const Task = db.Task

router.get("/", async (req, res) => {
    let where = null
    
    if(req.query.username && typeof req.query.username === 'string'){
        where = {
            username: req.query.username
        }
    } else if(req.query.id && !isNaN(parseInt(req.query.id))){
        where = {
            id: parseInt(req.query.id)
        }
    } else {
        return res.status(400).send(JSON.stringify(Responses.BadRequest("username or id", "string or number")))
    }

    let boards = await Board.findAll({
        where,
        include: [Task],
        limit: req.query.limit || 100,
        offset: req.query.offset || 0,
        order: [["createdAt", "DESC"]],
    })
    if (boards.length < 1){
        return res.status(404).send(JSON.stringify(Responses.NotFound("board")))
    }
    return res.json({boards: boards, statusCode:200})

})

router.post("/", async (req, res) => {
    let {name, username} = req.body
    console.log(req.headers)
    let decoded;
    try {
        decoded = jwt.verify(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET);
        if(decoded.username !== username){
            return res.status(401).send(req.headers.authorization.replace("Bearer ", ""))
        }
    } catch (err) {
        return res.status(401).send('pop');
    }

    let user = await User.findAll({where: {username}})
    if(user.length === 0){
        return res.status(404).send(JSON.stringify(NotFound("user")))
    }
    Board.create({
        username: username,
        userID: 14,
        name: name
    })
        .then(board => {
            return res.json({
                board: {
                    name: board.get("name"),
                    id: board.get("id"),
                    tasks: []
                },
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

router.patch("/", (req, res) => {
    res.json({
        message: "/api/board patch"
    })
})

module.exports = router