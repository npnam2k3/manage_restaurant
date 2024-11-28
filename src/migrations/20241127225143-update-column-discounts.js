"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Discounts", "purchased_orders_count");
    await queryInterface.removeColumn(
      "Discounts",
      "purchased_amount_per_order"
    );
    await queryInterface.addColumn("Discounts", "total_money_spent", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("Discounts", "is_loyalty_customer", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Discounts", "purchased_orders_count", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("Discounts", "purchased_amount_per_order", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.removeColumn("Discounts", "total_money_spent");
    await queryInterface.removeColumn("Discounts", "is_loyalty_customer");
  },
};