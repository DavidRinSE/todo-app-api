let jwt = require('jsonwebtoken')
let db = require('../models')
let testToken = async (token, username) => {
    let decoded;
    try {
        decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        if(decoded.username !== username){
            return false
        }
    } catch (err) {
        return false;
    }

    let user = await db.User.findAll({where: {username}})
    if(user.length === 0){
        return false
    }
    return true
}

module.exports = testToken