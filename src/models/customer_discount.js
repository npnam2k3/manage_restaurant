"use strict";
const { Model, DataTypes } = require("sequelize");
const instanceMySQL = require("../dbs/init.mysqldb");

class CustomerDiscount extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
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
