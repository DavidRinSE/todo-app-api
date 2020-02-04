const express = require("express");
const router = express.Router();
const db = require("../models")

const User = db.User

router.post("/login", (req, res) => {
    res.json({
        message: "/api/auth/login post",
    })
})

router.post("/logout", (req, res) => {
    res.json({
        message: "/api/auth/logout post"
    })
})

module.exports = router