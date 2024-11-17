"use strict";
const { Model, DataTypes } = require("sequelize");
const instanceMySQL = require("../dbs/init.mysqldb");
class Table_FoodMenu extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {}
}
Table_FoodMenu.init(
  {
    table_id: DataTypes.INTEGER,
    food_menu_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
  },
  {
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "Table_FoodMenu",
    tableName: "Table_Food_Menu",
  }
);
module.exports = Table_FoodMenu;
