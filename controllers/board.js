const express = require("express");
const router = express.Router();
const db = require("../models");
const Responses = require("./responses");

const Board = db.Board
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

router.post("/", (req, res) => {
    res.json({
        message: "/api/board post"
    })
})

router.patch("/", (req, res) => {
    res.json({
        message: "/api/board patch"
    })
})

module.exports = router