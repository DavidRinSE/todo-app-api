const express = require("express");
const router = express.Router();
const db = require("../models")

const Board = db.Board

router.get("/", (req, res) => {
    res.json({
        message: "/api/board get"
    })
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