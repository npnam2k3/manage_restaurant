"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Orders", "table_id");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Orders", "table_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "tables",
        key: "id",
      },
    });
  },
};
