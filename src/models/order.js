"use strict";
const { Model, DataTypes } = require("sequelize");
const instanceMySQL = require("../dbs/init.mysqldb");
class Order extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Order.belongsToMany(models.FoodMenu, {
      through: "OrderItem",
      foreignKey: "order_id",
    });
    Order.belongsTo(models.Customer, { foreignKey: "customer_id" });
    Order.belongsToMany(models.Discount, {
      through: "OrderDiscount",
      foreignKey: "order_id",
    });
  }
}
Order.init(
  {
    total_price: DataTypes.BIGINT,
    customer_id: DataTypes.INTEGER,
  },
  {
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "Order",
  }
);
module.exports = Order;
