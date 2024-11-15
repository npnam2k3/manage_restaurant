"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Tables", "seat_number", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.removeColumn("Tables", "reservation_time");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Tables", "seat_number");
    await queryInterface.addColumn("Tables", "reservation_time", {
      type: Sequelize.DATE,
    });
  },
};
