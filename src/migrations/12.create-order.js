"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      table_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "tables",
          key: "id",
        },
      },
      status: {
        type: Sequelize.ENUM("paid", "unpaid"),
        defaultValue: "unpaid",
      },
      discount_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "discounts",
          key: "id",
        },
      },
      total_price: {
        type: Sequelize.BIGINT,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Orders");
  },
};
