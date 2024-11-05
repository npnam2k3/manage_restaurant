"use strict";
const { Model, DataTypes } = require("sequelize");
const instanceMySQL = require("../dbs/init.mysqldb");
class UserShift extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
UserShift.init(
  {
    shift_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    work_date: DataTypes.DATE,
    status: DataTypes.ENUM("work", "off"),
  },
  {
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "UserShift",
    tableName: "User_Shifts",
  }
);
module.exports = UserShift;
