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
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "Order",
  }
);
module.exports = Order;
