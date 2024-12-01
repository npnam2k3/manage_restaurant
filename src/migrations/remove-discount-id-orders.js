"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Orders", "discount_id");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Orders", "discount_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "discounts",
        key: "id",
      },
    });
  },
};
