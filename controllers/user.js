const express = require("express");
const router = express.Router();
const db = require("../models")

const User = db.User

router.post("/", (req, res) => {
    res.json({
        message: "/api/user post"
    })
})

module.exports = router