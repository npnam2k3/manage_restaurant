"use strict";
const { Model, DataTypes } = require("sequelize");
const instanceMySQL = require("../dbs/init.mysqldb");
class FoodCategory extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    FoodCategory.hasMany(models.FoodMenu);
  }
}
FoodCategory.init(
  {
    name: DataTypes.STRING,
  },
  {
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "FoodCategory",
    tableName: "Food_Categories",
  }
);
module.exports = FoodCategory;
