const express = require("express");
const router = express.Router();
const db = require("../models");
const testToken = require("./testToken")

const Board = db.Board
const Task = db.Task

router.get("/", async (req, res) => {
    let where = null
    
    if(req.query.id && !isNaN(parseInt(req.query.id))){
        where = {
            id: parseInt(req.query.id)
        }
    } else if(req.query.username && typeof req.query.username === 'string'){
        where = {
            username: req.query.username
        }
    } else {
        return res.status(400).send({message:"Request query missing username (string) or id (number)", statusCode:400})
    }

    let boards = await Board.findAll({
        where,
        include: [{model:Task, as:"tasks"}],
        limit: req.query.limit || 100,
        offset: req.query.offset || 0,
        order: [["createdAt", "DESC"]],
    })
    if (boards.length < 1){
        return res.status(404).send({message:"No board found with that id or username", statusCode:404})
    }
    return res.json({boards: boards, statusCode:200})

})

router.post("/", async (req, res) => {
    let {name, username} = req.body

    let tokenDoesPass = await testToken(req.headers.authorization, username)
    if(!tokenDoesPass){
        return res.status(400).send({message:"Bad token or missing username", statusCode:404})
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

router.patch("/", async (req, res) => {
    let {name, username} = req.body
    let {id} = req.query


    let tokenDoesPass = await testToken(req.headers.authorization, username)
    if(!tokenDoesPass){
        return res.status(400).send({message:"Bad token or missing username", statusCode:404})
    }

    let result = await Board.update(
        {name: name},
        {where: {id}}
    )
    if(result[0] === 1){
        res.send({message:"success", statusCode:200})
    } else {
        res.status(404).send({message:"No board found with that id", statusCode:404})
    }

    
})

router.delete("/", async (req, res) => {
    let {username} = req.body
    let {id} = req.query

    let tokenDoesPass = await testToken(req.headers.authorization, username)
    if(!tokenDoesPass){
        return res.status(400).send({message:"Bad token or missing username", statusCode:404})
    }

    board = await Board.findAll({where: {id}})
    if(board.length > 0){
        Board.destroy({
            where: {id}
        }).then(() => {
            res.send({message:"success",statusCode:200})
        })
    } else {
        res.status(404).send({message:"No board with that id found", statusCOde:404})
    }

    
})

module.exports = router