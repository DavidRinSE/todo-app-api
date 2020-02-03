'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    boardID: {type: DataTypes.INTEGER, allowNull:false},
    name: {type: DataTypes.STRING, allowNull: false},
    isCompleted: {type: DataTypes.STRING(1).BINARY, allowNull:false}
  }, {});
  Task.associate = function(models) {
    // associations can be defined here
  };
  return Task;
};