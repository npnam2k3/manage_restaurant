"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Orders", "status");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Orders", "status", {
      type: Sequelize.ENUM("paid", "unpaid"),
      defaultValue: "unpaid",
    });
  },
};
