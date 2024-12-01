"use strict";
const { Model, DataTypes } = require("sequelize");
const instanceMySQL = require("../dbs/init.mysqldb");

class CustomerDiscount extends Model {
  static associate(models) {
    CustomerDiscount.belongsTo(models.Discount, { foreignKey: "discount_id" });
    CustomerDiscount.belongsTo(models.Customer, { foreignKey: "customer_id" });
  }
}
CustomerDiscount.init(
  {
    customer_id: DataTypes.INTEGER,
    discount_id: DataTypes.INTEGER,
    status: DataTypes.ENUM("active", "used", "expired"),
  },
  {
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "CustomerDiscount",
    tableName: "Customer_Discounts",
  }
);
module.exports = CustomerDiscount;
