"use strict";
const { Model, DataTypes } = require("sequelize");
const instanceMySQL = require("../dbs/init.mysqldb");
class TableCustomer extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
TableCustomer.init(
  {
    table_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Table",
        key: "id",
      },
    },
    customer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Customer",
        key: "id",
      },
    },
  },
  {
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "TableCustomer",
    tableName: "Table_Customer",
  }
);
module.exports = TableCustomer;
