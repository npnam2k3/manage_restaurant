"use strict";
const { Model, DataTypes } = require("sequelize");
const instanceMySQL = require("../dbs/init.mysqldb");
class Shift extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Shift.belongsToMany(models.User, { through: "UserShift" });
  }
}
Shift.init(
  {
    shift_name: DataTypes.STRING,
    start_time: DataTypes.TIME,
    end_time: DataTypes.TIME,
  },
  {
    sequelize: instanceMySQL,
    paranoid: true,
    modelName: "Shift",
  }
);
module.exports = Shift;
