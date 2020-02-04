const express = require("express");
const router = express.Router();
const db = require("../models")

const Board = db.Board

router.get("/", (req, res) => {
    res.json({
        message: "/api/boards get"
    })
})

module.exports = router