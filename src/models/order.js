"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsToMany(models.FoodMenu, { through: "OrderItem" });
      Order.belongsTo(models.Discount);
    }
  }
  Order.init(
    {
      table_id: DataTypes.INTEGER,
      status: DataTypes.ENUM("paid", "unpaid"),
      discount_id: DataTypes.INTEGER,
      total_price: DataTypes.BIGINT,
    },
    {
      sequelize,
      paranoid: true,
      modelName: "Order",
    }
  );
  return Order;
};
