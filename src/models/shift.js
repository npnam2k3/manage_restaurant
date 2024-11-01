"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Shift extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Shift.belongsToMany(models.InfoUser, { through: "UserInfoShift" });
    }
  }
  Shift.init(
    {
      shift_name: DataTypes.STRING,
      start_time: DataTypes.TIME,
      end_time: DataTypes.TIME,
    },
    {
      sequelize,
      paranoid: true,
      modelName: "Shift",
    }
  );
  return Shift;
};
