"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("User_Info_Shifts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      shift_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "shifts",
          key: "id",
        },
      },
      info_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "info_users",
          key: "id",
        },
      },
      work_date: {
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.ENUM("work", "off"),
        defaultValue: "off",
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
    await queryInterface.dropTable("User_Info_Shifts");
  },
};
