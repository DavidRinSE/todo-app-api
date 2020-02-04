const express = require("express");
const router = express.Router();
const db = require("../models")

const Task = db.Task

router.get("/", (req, res) => {
    res.json({
        message: "/api/task get"
    })
})

router.post("/", (req, res) => {
    res.json({
        message: "/api/task post"
    })
})

router.patch("/", (req, res) => {
    res.json({
        message: "/api/task patch"
    })
})

module.exports = router