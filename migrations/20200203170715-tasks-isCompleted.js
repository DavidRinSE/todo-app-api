'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE "Tasks"
        ADD COLUMN "isCompleted" bit;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE "Tasks"
        DROP COLUMN "isCompleted";
    `)
  }
};