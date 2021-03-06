const express = require("express");
const router = express.Router();
const db = require("../models");
const Sequelize = db.Sequelize
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
        return res.status(400).send({message:"Request query missing username (string) or id (number)", statusCode:400})
    }

    let tasks = await Task.findAll({
        where,
        limit: req.query.limit || 100,
        offset: req.query.offset || 0,
        order: [["createdAt", "DESC"]],
    })
    if (tasks.length < 1){
        return res.status(404).send({message:"No task found with that id or BoardID", statusCode:404})
    }
    return res.json({tasks: tasks, statusCode:200})

})

router.post("/", async (req, res) => {
    let {name, username, boardID} = req.body
    
    let tokenDoesPass = await testToken(req.headers.authorization, username)
    if(!tokenDoesPass){
        return res.status(400).send({message:"Bad token or missing username", statusCode:404})
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

    let tokenDoesPass = await testToken(req.headers.authorization, username)
    if(!tokenDoesPass){
        return res.status(400).send({message:"Bad token or missing username", statusCode:404})
    }

    let result = await Task.update(
        updateData,
        {where: {id}}
    )
    if(result[0] === 1){
        res.send({message:"success", statusCode:200})
    } else {
        res.status(404).send({message:"No task found with that id", statusCode:404})
    }

    
})

router.delete("/", async (req, res) => {
    let {username} = req.body
    let {id} = req.query

    let tokenDoesPass = await testToken(req.headers.authorization, username)
    if(!tokenDoesPass){
        return res.status(400).send({message:"Bad token or missing username", statusCode:404})
    }

    task = await Task.findAll({where: {id}})
    if(task.length > 0){
        Task.destroy({
            where: {id}
        }).then(() => {
            res.send({message:"success",statusCode:200})
        })
    } else {
        res.status(404).send({message:"No task found with that id", statusCode:404})
    }

    
})

module.exports = router