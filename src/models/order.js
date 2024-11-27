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
    Order.belongsTo(models.Table, { foreignKey: "table_id" });
    Order.belongsTo(models.Discount, { foreignKey: "discount_id" });
  }
}
Order.init(
  {
    table_id: DataTypes.INTEGER,
    discount_id: DataTypes.INTEGER,
    total_price: DataTypes.BIGINT,
  },
  {
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "Order",
  }
);
module.exports = Order;
