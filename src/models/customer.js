"use strict";
const { Model, DataTypes } = require("sequelize");
const instanceMySQL = require("../dbs/init.mysqldb");

class Customer extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Customer.hasMany(models.Table, { foreignKey: "customer_id" });
    Customer.belongsToMany(models.Discount, { through: "CustomerDiscount" });
  }
}
Customer.init(
  {
    full_name: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    order_count: DataTypes.INTEGER,
  },
  {
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "Customer",
  }
);
module.exports = Customer;
