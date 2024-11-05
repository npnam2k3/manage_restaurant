"use strict";
const { Model, DataTypes } = require("sequelize");
const instanceMySQL = require("../dbs/init.mysqldb");
class Unit extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Unit.hasMany(models.FoodMenu);
  }
}
Unit.init(
  {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
  },
  {
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "Unit",
  }
);
module.exports = Unit;
