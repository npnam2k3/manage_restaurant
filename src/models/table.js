"use strict";
const { Model, DataTypes } = require("sequelize");
const instanceMySQL = require("../dbs/init.mysqldb");
class Table extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Table.belongsToMany(models.Customer, {
      through: "Table_Customer",
      foreignKey: "table_id",
    });
    Table.hasOne(models.Order, { foreignKey: "table_id" });
    Table.belongsToMany(models.FoodMenu, {
      through: "Table_FoodMenu",
      foreignKey: "table_id",
    });
  }
}
Table.init(
  {
    number: DataTypes.INTEGER,
    status: DataTypes.ENUM("available", "reserved", "occupied"),
    // reserved: da dat truoc
    // available: con trong
    // occupied: dang co khach ngoi
    seat_number: DataTypes.INTEGER,
  },
  {
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "Table",
    tableName: "Tables",
  }
);
module.exports = Table;
