'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(process.env.DATABASE_URL);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

let User = sequelize.import(__dirname + "/User.js")
let Task = sequelize.import(__dirname + "/Task.js")
let Board = sequelize.import(__dirname + "/Board.js")

Board.hasMany(Task, {
  foreignKey: "boardID",
  as:"tasks"
})

db.User = User
db.Task = Task
db.Board = Board

module.exports = db;
