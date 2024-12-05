"use strict";
const { Model, DataTypes } = require("sequelize");
const instanceMySQL = require("../dbs/init.mysqldb");
class TableCustomer extends Model {
  static associate(models) {
    TableCustomer.belongsTo(models.Customer, { foreignKey: "customer_id" });
    TableCustomer.belongsTo(models.Table, { foreignKey: "table_id" });
  }
}
TableCustomer.init(
  {
    table_id: {
      type: DataTypes.INTEGER,
    },
    customer_id: {
      type: DataTypes.INTEGER,
    },
    time_reserved: {
      type: DataTypes.DATE,
    },
    status: DataTypes.ENUM("available", "reserved", "occupied"),
    // reserved: da dat truoc
    // available: con trong
    // occupied: dang co khach ngoi
  },
  {
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "TableCustomer",
    tableName: "Table_Customer",
  }
);
module.exports = TableCustomer;
