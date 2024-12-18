"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Customer.hasMany(models.Table);
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
      sequelize,
      paranoid: true,
      modelName: "Customer",
    }
  );
  return Customer;
};
