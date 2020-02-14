const express = require("express");
const router = express.Router();
const db = require("../models");
const Sequelize = db.Sequelize
const Responses = require("./responses");
const testToken = require("./testToken")

const Task = db.Task

router.get("/", async (req, res) => {
    let where = null
    
    if(req.query.boardID && typeof req.query.boardID === 'string'){
        where = {
            boardID: req.query.boardID
        }
    } else if(req.query.id && !isNaN(parseInt(req.query.id))){
        where = {
            id: parseInt(req.query.id)
        }
    } else {
        return res.status(400).send(JSON.stringify(Responses.BadRequest("username or id", "string or number")))
    }

    let tasks = await Task.findAll({
        where,
        limit: req.query.limit || 100,
        offset: req.query.offset || 0,
        order: [["createdAt", "DESC"]],
    })
    if (tasks.length < 1){
        return res.status(404).send(JSON.stringify(Responses.NotFound("task")))
    }
    return res.json({tasks: tasks, statusCode:200})

})

router.post("/", async (req, res) => {
    let {name, username, boardID} = req.body
    console.log(name)
    if(!testToken(req.headers.authorization, username)){
        return res.status(400).send("Bad token or username")
    }
    
    Task.create({
        boardID: boardID,
        name: name, 
        isCompleted:0
    })
        .then(task => {
            return res.json({
                task: {
                    boardID: task.get("boadID"),
                    name: task.get("name"),
                    isCompleted: task.get("isCompleted")
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
    const updateData = {
        ...(req.body.name) && {name: req.body.name},
        ...(req.body.boardID) && {boardID: req.body.boardID},
        ...(req.body.isCompleted) && {isCompleted: req.body.isCompleted},
    }
    const username = req.body.username
    const {id} = req.query

    if(!testToken(req.headers.authorization, username)){
        return res.status(400).send("Bad token or username")
    }

    let result = await Task.update(
        updateData,
        {where: {id}}
    )
    if(result[0] === 1){
        res.send({message:"success", statusCode:200})
    } else {
        res.status(404).send(Responses.NotFound("task"))
    }

    
})

router.delete("/", async (req, res) => {
    let {username} = req.body
    let {id} = req.query

    if(!testToken(req.headers.authorization, username)){
        return res.status(400).send("Bad token or username")
    }

    task = await Task.findAll({where: {id}})
    if(task.length > 0){
        Task.destroy({
            where: {id}
        }).then(() => {
            res.send({message:"success",statusCode:200})
        })
    } else {
        res.status(404).send(Responses.NotFound("task"))
    }

    
})

module.exports = router