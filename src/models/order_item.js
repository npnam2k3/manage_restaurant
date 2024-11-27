"use strict";
const { Model, DataTypes } = require("sequelize");
const instanceMySQL = require("../dbs/init.mysqldb");
class OrderItem extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    OrderItem.belongsTo(models.FoodMenu, { foreignKey: "food_menu_id" });
    OrderItem.belongsTo(models.Order, { foreignKey: "order_id" });
  }
}
OrderItem.init(
  {
    order_id: DataTypes.INTEGER,
    food_menu_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
  },
  {
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "OrderItem",
    tableName: "Order_Items",
  }
);
module.exports = OrderItem;
