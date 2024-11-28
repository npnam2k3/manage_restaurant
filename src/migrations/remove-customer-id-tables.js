"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Tables", "customer_id");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Tables", "customer_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "customers",
        key: "id",
      },
    });
  },
};
