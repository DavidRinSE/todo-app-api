let controller = {}

controller.user = require("./user")
controller.auth = require("./auth")
controller.board = require("./board")
controller.task = require("./task")

module.exports = {controller}