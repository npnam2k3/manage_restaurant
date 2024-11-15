"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Table_Food_Menu", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      table_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Tables", // Tên bảng Table
          key: "id",
        },
      },
      food_menu_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Food_Menus", // Tên bảng Food_Menu
          key: "id",
        },
      },
      quantity: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("Table_Food_Menu");
  },
};
