'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE "Boards"
        ADD COLUMN "userID" integer;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      ALTER TABLE "Boards"
        DROP COLUMN "userID";
    `)
  }
};
