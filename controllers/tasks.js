const express = require("express");
const router = express.Router();
const db = require("../models")

const Task = db.Task

router.get("/", (req, res) => {
    res.json({
        message: "/api/tasks get"
    })
})

module.exports = router