"use strict";
const { Model, DataTypes } = require("sequelize");
const instanceMySQL = require("../dbs/init.mysqldb");
class Discount extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Discount.belongsToMany(models.Customer, { through: "CustomerDiscount" });
    Discount.hasMany(models.Order, { foreignKey: "discount_id" });
  }
}
Discount.init(
  {
    code: DataTypes.STRING,
    description: DataTypes.STRING,
    discount_amount: DataTypes.INTEGER,
    discount_type: DataTypes.ENUM("percentage", "amount"),
    min_order_value: DataTypes.INTEGER,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    is_anniversary: DataTypes.BOOLEAN,
    is_loyalty_customer: DataTypes.BOOLEAN,
    total_money_spent: DataTypes.INTEGER,
  },
  {
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "Discount",
  }
);
module.exports = Discount;
