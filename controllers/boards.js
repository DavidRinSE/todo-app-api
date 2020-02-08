const express = require("express");
const router = express.Router();
const db = require("../models");
const Responses = require("./responses");

const Board = db.Board
const Task = db.Task

router.get("/:username", async (req, res) => {
    let { username } = req.params

    if(!username || typeof username !== 'string'){
        res.status(400).send(JSON.stringify(Responses.BadRequest("username", "string")))
    }else {
        let boards = await Board.findAll({
            where: {username},
            include: [Task],
            limit: req.query.limit || 100,
            offset: req.query.offset || 0,
            order: [["createdAt", "DESC"]],
        })
        if (boards.length < 1){
            return res.status(404).send(JSON.stringify(Responses.NotFound("board")))
        }
        return res.json({boards: boards, statusCode:200})
    }
})

module.exports = router