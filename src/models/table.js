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
    Table.belongsTo(models.Customer);
    Table.hasOne(models.Order);
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
    customer_id: DataTypes.INTEGER,
    seat_number: DataTypes.INTEGER,
  },
  {
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "Table",
  }
);
module.exports = Table;
