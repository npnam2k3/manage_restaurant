"use strict";
const { Model, DataTypes } = require("sequelize");
const instanceMySQL = require("../dbs/init.mysqldb");
const Order = require("./order");
class FoodMenu extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    FoodMenu.belongsToMany(Order, { through: "OrderItem" });
    FoodMenu.belongsTo(models.FoodCategory, { foreignKey: "category_id" });
    FoodMenu.belongsTo(models.Unit, { foreignKey: "unit_id" });
    FoodMenu.belongsToMany(models.Table, { through: "Table_FoodMenu" });
  }
}
FoodMenu.init(
  {
    name: DataTypes.STRING,
    image_url: DataTypes.STRING,
    price: DataTypes.BIGINT,
    category_id: DataTypes.INTEGER,
    unit_id: DataTypes.INTEGER,
  },
  {
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "FoodMenu",
    tableName: "Food_Menus",
  }
);
module.exports = FoodMenu;
