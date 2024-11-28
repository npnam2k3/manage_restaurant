"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Customers", "order_count");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Customers", "order_count", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },
};
