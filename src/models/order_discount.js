"use strict";
const { Model, DataTypes } = require("sequelize");
const instanceMySQL = require("../dbs/init.mysqldb");
class OrderDiscount extends Model {
  static associate(models) {
    OrderDiscount.belongsTo(models.Discount, { foreignKey: "discount_id" });
    OrderDiscount.belongsTo(models.Order, { foreignKey: "order_id" });
  }
}
OrderDiscount.init(
  {
    order_id: DataTypes.INTEGER,
    discount_id: DataTypes.INTEGER,
  },
  {
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "OrderDiscount",
    tableName: "Order_Discount",
  }
);
module.exports = OrderDiscount;
