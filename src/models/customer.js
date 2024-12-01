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
    Customer.belongsToMany(models.Table, {
      through: "Table_Customer",
      foreignKey: "customer_id",
    });
    Customer.hasMany(models.Order, { foreignKey: "customer_id" });
    Customer.belongsToMany(models.Discount, {
      through: "CustomerDiscount",
      foreignKey: "customer_id",
    });
  }
}
Customer.init(
  {
    full_name: DataTypes.STRING,
    phone_number: DataTypes.STRING,
  },
  {
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "Customer",
    tableName: "Customers",
  }
);
module.exports = Customer;
