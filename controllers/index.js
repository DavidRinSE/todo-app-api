let controller = {}

controller.user = require("./user")
controller.auth = require("./auth")
controller.board = require("./board")
controller.boards = require("./boards")
controller.task = require("./task")
controller.tasks = require("./tasks")

module.exports = {controller}