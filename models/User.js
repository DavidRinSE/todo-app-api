'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail:true
      },
      unique: {
          args: true,
          msg: 'Email address already in use!'
      }
    },
    password: DataTypes.STRING,
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
          args: true,
          msg: 'Username already in use!'
      }
    },
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};