"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Tables", "status");
    await queryInterface.addColumn("Table_Customer", "status", {
      type: Sequelize.ENUM("available", "reserved", "occupied"),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Tables", "status", {
      type: Sequelize.ENUM("available", "reserved", "occupied"),
    });
    await queryInterface.removeColumn("Table_Customer", "status");
  },
};
